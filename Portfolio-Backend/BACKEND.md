# Portfolio Backend — Next.js 15 + Supabase + TypeScript

A production-ready backend for a personal portfolio website. Built on Next.js 15 App Router, Supabase (Postgres + Auth + Storage), and TypeScript with Zod validation.

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (secret) |
| `ADMIN_EMAIL` | The email you'll log into the admin with |
| `SMTP_*` | Your email provider SMTP credentials |

### 3. Run the Database Schema

In **Supabase → SQL Editor**, paste and run the contents of:

```
supabase/schema.sql
```

This creates all tables, enables RLS, sets up storage buckets, and creates indexes.

### 4. Create Your Admin User

In **Supabase → Authentication → Users**, create a user with the same email you set in `ADMIN_EMAIL`.

### 5. Run the Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000/admin/login` to access the admin panel.

---

## Architecture

```
portfolio/
├── app/
│   ├── api/
│   │   ├── contact/            # POST (public), GET (admin)
│   │   ├── projects/           # GET (public), POST (admin)
│   │   │   └── [id]/           # GET, PATCH, DELETE
│   │   ├── blogs/              # GET (public), POST (admin)
│   │   │   └── [id]/           # GET (slug or UUID), PATCH, DELETE
│   │   ├── certifications/     # GET (public), POST (admin)
│   │   │   └── [id]/           # GET, PATCH, DELETE
│   │   ├── testimonials/       # GET (public), POST (admin)
│   │   │   └── [id]/           # GET, PATCH, DELETE
│   │   ├── analytics/          # POST (public, rate-limited), GET (admin)
│   │   ├── storage/
│   │   │   └── [bucket]/       # POST upload, DELETE
│   │   └── auth/
│   │       ├── login/          # POST
│   │       ├── logout/         # POST
│   │       ├── session/        # GET
│   │       └── callback/       # GET (OAuth)
│   └── admin/                  # Admin panel UI
│       ├── login/
│       ├── page.tsx            # Dashboard
│       ├── projects/
│       ├── blogs/
│       ├── certifications/
│       ├── testimonials/
│       ├── contacts/
│       └── analytics/
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server/SSR client (cookies)
│   │   └── admin.ts            # Service role client
│   ├── auth/
│   │   └── session.ts          # requireAdmin(), getUser()
│   ├── storage/
│   │   └── upload.ts           # uploadFile(), deleteFile(), replaceFile()
│   ├── validation/
│   │   ├── schemas.ts          # All Zod schemas
│   │   └── rate-limit.ts       # In-memory sliding window rate limiter
│   ├── services/
│   │   ├── email.ts            # Nodemailer notifications
│   │   ├── pagination.ts       # Generic Supabase paginator
│   │   └── response.ts         # ok(), err(), validationError() helpers
│   └── hooks/
│       ├── useContact.ts       # Contact form hook
│       └── useAnalytics.ts     # Analytics tracking hook
├── middleware.ts               # Session refresh + route protection
├── types/index.ts              # Shared TypeScript types
└── supabase/schema.sql         # Full database schema
```

---

## API Reference

### Contact

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/contact` | Public | Submit contact form |
| `GET`  | `/api/contact?page=1&limit=20` | Admin | List all messages |

**POST body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Project inquiry",
  "message": "Hi, I'd love to work together..."
}
```

### Projects / Blogs / Certifications / Testimonials

All follow the same CRUD pattern:

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET`  | `/api/{resource}` | Public | List with pagination |
| `POST` | `/api/{resource}` | Admin | Create |
| `GET`  | `/api/{resource}/:id` | Public | Get single |
| `PATCH`| `/api/{resource}/:id` | Admin | Update (partial) |
| `DELETE`| `/api/{resource}/:id` | Admin | Delete |

**Pagination query params:** `page`, `limit`, `search`, `orderBy`, `order`

**Blogs** also accepts `slug` as the `:id` parameter.

### Storage

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/storage/:bucket` | Admin | Upload file |
| `DELETE`| `/api/storage/:bucket?path=...` | Admin | Delete file |

**Buckets:** `projects`, `blogs`, `certifications`, `avatars`, `resume`

**Upload (multipart/form-data):**
- `file` — the file
- `folder` — optional subfolder (e.g. `thumbnails`)

**Max file size:** 5 MB. Allowed types: JPEG, PNG, WebP, GIF, SVG (+ PDF for resume bucket).

### Analytics

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/analytics` | Public | Track event |
| `GET`  | `/api/analytics?days=30` | Admin | Dashboard stats |

**Event types:** `page_view`, `project_click`, `resume_download`, `contact_submit`, `blog_view`, `github_click`, `live_url_click`

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/login` | Public | Sign in with email/password |
| `POST` | `/api/auth/logout` | Public | Sign out |
| `GET`  | `/api/auth/session` | Public | Get current user |

---

## Frontend Integration

### Contact Form

Replace the mock `handleSubmit` in `ContactSection.tsx` — the updated version is already in `components/sections/ContactSection.tsx`.

The `useContact` hook handles everything:

```tsx
import { useContact } from '@/lib/hooks/useContact';

const { sending, sent, error, fieldErrors, submit, reset } = useContact();
```

### Analytics Tracking

Add to any component:

```tsx
import { useAnalytics } from '@/lib/hooks/useAnalytics';

const { track } = useAnalytics();

// Track a project click
<a onClick={() => track('project_click', { projectId: id, title })}>

// Track resume download
<a onClick={() => track('resume_download')}>
```

### Auto Page View Tracking

Add `<PageTracker />` to your root layout:

```tsx
// app/layout.tsx
import { PageTracker } from '@/components/PageTracker';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PageTracker />
        {children}
      </body>
    </html>
  );
}
```

### Loading Data from Supabase (Server Components)

```tsx
// In any Server Component
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('featured', true)
  .order('order_index');
```

---

## Security

- **RLS** — Row Level Security on all tables. Public can only read; only the admin email can mutate.
- **Rate limiting** — Contact: 5/15min per IP. Login: 10/15min per IP. Analytics: 60/min per IP.
- **Honeypot** — Hidden `website` field in contact form catches most bots.
- **Zod validation** — Every API input is validated with typed schemas before touching the database.
- **Admin guard** — All mutating routes call `requireAdmin()` which verifies the JWT email matches `ADMIN_EMAIL`.
- **Security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` set on all responses via middleware.
- **Service role key** — Only used server-side via `createAdminClient()`, never exposed to the browser.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local.example`
4. Deploy

The `middleware.ts` and API routes work out of the box on Vercel's Edge and Node runtimes.

> **Note on rate limiting:** The in-memory rate limiter resets on cold starts. For production at scale, replace `lib/validation/rate-limit.ts` with an [Upstash Redis](https://upstash.com) implementation.
