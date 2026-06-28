import { NextRequest } from 'next/server';
import { ok, err } from '@/lib/services/response';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';

// GitHub username — set via env var or hardcode your username here
const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'github';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional: increases rate limit from 60 to 5000 req/hr

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-yellow-500',
  CSS: 'bg-pink-500',
  HTML: 'bg-orange-500',
  Go: 'bg-cyan-400',
  Rust: 'bg-orange-600',
  Java: 'bg-red-500',
  Shell: 'bg-green-400',
};

function githubHeaders() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (GITHUB_TOKEN) h['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

async function fetchJSON(url: string) {
  const res = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${url}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  // Rate limit: 10 requests per minute per IP
  const ip = getIP(req);
  const rl = rateLimit({ key: `github:${ip}`, limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return err('Too many requests', 429);
  }

  try {
    // ── Fetch user + repos in parallel ────────────────────────
    const [user, repos] = await Promise.all([
      fetchJSON(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetchJSON(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
    ]);

    // ── Aggregate stars, forks, languages ─────────────────────
    let totalStars = 0;
    let totalForks = 0;
    const langBytes: Record<string, number> = {};

    // Fetch languages for top 10 repos (by stars) to avoid rate limits
    const topRepos = [...repos]
      .sort((a: { stargazers_count: number }, b: { stargazers_count: number }) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);

    const langResults = await Promise.allSettled(
      topRepos.map((r: { languages_url: string }) => fetchJSON(r.languages_url))
    );

    for (const repo of repos) {
      totalStars += repo.stargazers_count ?? 0;
      totalForks += repo.forks_count ?? 0;
    }

    for (const result of langResults) {
      if (result.status === 'fulfilled') {
        for (const [lang, bytes] of Object.entries(result.value as Record<string, number>)) {
          langBytes[lang] = (langBytes[lang] ?? 0) + bytes;
        }
      }
    }

    // ── Calculate top languages ────────────────────────────────
    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
    const topLanguages = Object.entries(langBytes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, bytes]) => ({
        name,
        percent: Math.round((bytes / totalBytes) * 100),
        color: LANGUAGE_COLORS[name] ?? 'bg-gray-500',
      }));

    // Adjust last percent to sum to 100
    const sumPercent = topLanguages.reduce((s, l) => s + l.percent, 0);
    if (topLanguages.length > 0) topLanguages[topLanguages.length - 1].percent += 100 - sumPercent;

    // ── Build a fake-but-deterministic contribution grid from commit stats ──
    // GitHub's contribution graph requires GraphQL or scraping; we approximate
    // using the repos' push dates to estimate activity level per week/day.
    const contributions = buildContributionGrid(repos);

    // ── Commit count approximation (public events) ─────────────
    // True total commit count requires authenticated GraphQL query;
    // use public_repos * avg commits as an estimate, or fetch events
    const events = await fetchJSON(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`
    );
    const pushEvents = events.filter((e: { type: string }) => e.type === 'PushEvent');
    const recentCommits = pushEvents.reduce(
      (sum: number, e: { payload: { commits?: unknown[] } }) => sum + (e.payload.commits?.length ?? 0),
      0
    );

    return ok({
      login: user.login,
      totalStars,
      totalForks,
      totalCommits: Math.max(recentCommits * 12, repos.length * 25), // estimate
      streak: calculateStreak(pushEvents),
      topLanguages,
      contributions,
      publicRepos: user.public_repos,
      followers: user.followers,
    });
  } catch (e) {
    console.error('[GitHub API]', e);
    return err('Failed to load GitHub stats. Check GITHUB_USERNAME env var.', 500);
  }
}

/** Build a 26×7 contribution grid from push event timestamps */
function buildContributionGrid(repos: Array<{ pushed_at: string }>): number[][] {
  const now = Date.now();
  const sixMonthsAgo = now - 26 * 7 * 24 * 60 * 60 * 1000;

  // Count activity per (week, day) bucket based on repo push dates
  const grid: number[][] = Array.from({ length: 26 }, () => Array(7).fill(0));

  for (const repo of repos) {
    if (!repo.pushed_at) continue;
    const t = new Date(repo.pushed_at).getTime();
    if (t < sixMonthsAgo) continue;
    const daysAgo = Math.floor((now - t) / (24 * 60 * 60 * 1000));
    const weekIdx = 25 - Math.floor(daysAgo / 7);
    const dayIdx = new Date(repo.pushed_at).getDay();
    if (weekIdx >= 0 && weekIdx < 26) {
      grid[weekIdx][dayIdx] = Math.min(4, (grid[weekIdx][dayIdx] ?? 0) + 1);
    }
  }
  return grid;
}

/** Estimate streak from push events */
function calculateStreak(pushEvents: Array<{ created_at: string }>): number {
  if (!pushEvents.length) return 0;
  const days = new Set(
    pushEvents.map((e) => new Date(e.created_at).toISOString().slice(0, 10))
  );
  let streak = 0;
  let d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
