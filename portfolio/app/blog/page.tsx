import { eq, desc } from 'drizzle-orm';
import { db, blogs } from '@/lib/db';
import { Metadata } from 'next';
import { Clock, ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { Blog } from '@/types';

export const metadata: Metadata = {
  title: 'Blog — Articles & Writing',
  description: 'Engineering deep-dives, AI development, and lessons from building production software.',
};

export const dynamic = 'force-dynamic';

async function getPublishedPosts() {
  try {
    return await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        tags: blogs.tags,
        read_time: blogs.read_time,
        gradient: blogs.gradient,
        created_at: blogs.created_at,
      })
      .from(blogs)
      .where(eq(blogs.published, true))
      .orderBy(desc(blogs.created_at));
  } catch (e) {
    console.error('[Blog List] Failed to load posts:', e);
    return [];
  }
}

export default async function BlogListPage() {
  const posts = await getPublishedPosts();

  const articles = posts as unknown as Blog[];

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back to portfolio
        </Link>

        <div className="mb-14">
          <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-3">Writing</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            All{' '}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Articles
            </span>
          </h1>
          <p className="text-gray-400">
            Engineering deep-dives, AI development, and lessons from building in production.
          </p>
        </div>

        {/* Articles grid */}
        {articles.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p>No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {articles.map((post) => {
              const tag = post.tags?.[0] ?? 'Article';
              const dateStr = post.created_at
                ? new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '';

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="glass border border-white/6 rounded-2xl overflow-hidden hover:border-white/12 transition-all duration-500 hover:-translate-y-1">
                    <div className={`h-2 bg-gradient-to-r ${post.gradient}`} />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${post.gradient} text-white text-xs font-semibold`}
                        >
                          {tag}
                        </span>
                        {post.read_time && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                            <Clock size={11} />
                            {post.read_time}
                          </div>
                        )}
                      </div>
                      <h2 className="text-sm font-bold text-white leading-snug mb-3 group-hover:text-violet-300 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-white/6">
                        <span className="text-xs text-gray-600">{dateStr}</span>
                        <span className="text-xs text-violet-400 font-medium">Read more →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
