import { createClient } from '@/lib/supabase/server';

async function getStats() {
  const supabase = await createClient();
  const [projects, blogs, certs, testimonials, contacts, analytics] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('blogs').select('id', { count: 'exact', head: true }),
    supabase.from('certifications').select('id', { count: 'exact', head: true }),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }),
    supabase.from('contacts').select('id', { count: 'exact', head: true }),
    supabase
      .from('analytics')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  return {
    projects: projects.count ?? 0,
    blogs: blogs.count ?? 0,
    certifications: certs.count ?? 0,
    testimonials: testimonials.count ?? 0,
    contacts: contacts.count ?? 0,
    analytics30d: analytics.count ?? 0,
  };
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
