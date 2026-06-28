# Deployment Guide — Merged Portfolio

## Prerequisites
- Supabase project created at supabase.com
- Vercel account at vercel.com
- Node.js 20+

---

## 1. Supabase Setup

### Run the database schema
1. Go to **Supabase Dashboard → SQL Editor**
2. Paste and run the contents of `supabase/schema.sql`
3. This creates all tables: `projects`, `blogs`, `certifications`, `testimonials`, `contacts`, `analytics`

### Create Storage Buckets
In **Supabase → Storage**, create these buckets:
- `projects` (public)
- `blogs` (public)
- `certifications` (public)
- `avatars` (public)
- `resume` (private)

Upload your `resume.pdf` to the **resume** bucket.

### Get your API keys
Go to **Supabase → Project Settings → API**:
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### Create admin user
In **Supabase → Authentication → Users**, click **Add User**:
- Email: your admin email
- Set a strong password

---

## 2. Local Development

```bash
# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.local .env.local.bak  # already filled in
# Edit .env.local with your actual keys

# Run dev server
npm run dev
```

Visit:
- `http://localhost:3000` — portfolio homepage
- `http://localhost:3000/admin` — admin dashboard (requires login)
- `http://localhost:3000/blog` — blog listing

---

## 3. Deploy to Vercel

### Option A: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Option B: GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to vercel.com → **New Project** → Import repo
3. Framework: **Next.js** (auto-detected)
4. Add all environment variables from `.env.local`
5. Click **Deploy**

### Required Environment Variables in Vercel
Add these in **Vercel → Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ADMIN_EMAIL` | Your admin email |
| `SMTP_HOST` | SMTP server (e.g. smtp.gmail.com) |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password / app password |
| `NOTIFICATION_EMAIL` | Where contact form emails go |
| `GITHUB_USERNAME` | Your GitHub username |
| `NEXT_PUBLIC_SITE_URL` | https://yoursite.vercel.app |

---

## 4. Populate Content

After deploying, add your real data through the admin dashboard at `/admin`:

- **Projects** → add your real projects with images
- **Blogs** → write and publish articles
- **Certifications** → add your credentials
- **Testimonials** → add client reviews

The frontend sections will automatically switch from static fallback data to live Supabase data once you add entries.

---

## 5. Customize

All personal data (name, links, skills, experience) lives in `lib/data.ts`. Update these values:

- `navLinks` — navigation links
- `socialLinks` — social media URLs
- `roles` — typewriter roles in hero
- `skills` — skill categories and levels
- `experience` — work history (static, shown always)

The experience section is intentionally kept static (it rarely changes and doesn't need a DB).
