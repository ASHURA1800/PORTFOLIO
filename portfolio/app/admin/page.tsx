import { gte } from 'drizzle-orm';
import { db, projects, blogs, certifications, testimonials, contacts, analytics } from '@/lib/db';

// Admin dashboard is auth-gated and shows live counts — render per request,
// never statically prerendered at build time.
export const dynamic = 'force-dynamic';

const EMPTY_STATS = {
  projects: 0,
  blogs: 0,
  certifications: 0,
  testimonials: 0,
  contacts: 0,
  analytics30d: 0,
};

async function getStats() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    const [projectsCount, blogsCount, certsCount, testimonialsCount, contactsCount, analytics30d] =
      await Promise.all([
        db.$count(projects),
        db.$count(blogs),
        db.$count(certifications),
        db.$count(testimonials),
        db.$count(contacts),
        db.$count(analytics, gte(analytics.created_at, since)),
      ]);

    return {
      projects: projectsCount,
      blogs: blogsCount,
      certifications: certsCount,
      testimonials: testimonialsCount,
      contacts: contactsCount,
      analytics30d,
    };
  } catch (e) {
    console.error('[Admin Dashboard] Failed to load stats:', e);
    return EMPTY_STATS;
  }
}

const CARDS = [
  { key: 'projects',        label: 'Projects',          icon: '🚀', href: '/admin/projects' },
  { key: 'blogs',           label: 'Blog Posts',        icon: '✍️', href: '/admin/blogs' },
  { key: 'certifications',  label: 'Certifications',    icon: '🏆', href: '/admin/certifications' },
  { key: 'testimonials',    label: 'Testimonials',      icon: '💬', href: '/admin/testimonials' },
  { key: 'contacts',        label: 'Contact Messages',  icon: '📬', href: '/admin/contacts' },
  { key: 'analytics30d',    label: 'Events (30d)',       icon: '📈', href: '/admin/analytics' },
] as const;

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Portfolio content overview</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CARDS.map(({ key, label, icon, href }) => (
          <a
            key={key}
            href={href}
            className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:border-violet-500/30 hover:bg-white/6 transition-all group"
          >
            <div className="text-2xl mb-3">{icon}</div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats[key].toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
              {label}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 p-5 bg-white/4 border border-white/8 rounded-2xl">
        <h2 className="text-white font-semibold mb-3">Quick Start</h2>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Add your projects at <a href="/admin/projects" className="text-violet-400 hover:underline">/admin/projects</a></li>
          <li>• Write blog posts at <a href="/admin/blogs" className="text-violet-400 hover:underline">/admin/blogs</a></li>
          <li>• Upload images via <code className="text-violet-400">POST /api/storage/:bucket</code></li>
          <li>• Track analytics via <code className="text-violet-400">POST /api/analytics</code></li>
        </ul>
      </div>
    </div>
  );
}
