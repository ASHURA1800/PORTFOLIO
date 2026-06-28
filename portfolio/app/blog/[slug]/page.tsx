import { and, eq } from 'drizzle-orm';
import { db, blogs } from '@/lib/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import type { Blog } from '@/types';

export const dynamic = 'force-dynamic';

// ── Dynamic SEO metadata ──────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [data] = await db
    .select({
      title: blogs.title,
      excerpt: blogs.excerpt,
      tags: blogs.tags,
      created_at: blogs.created_at,
    })
    .from(blogs)
    .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
    .limit(1);

  if (!data) return { title: 'Article Not Found' };

  return {
    title: data.title,
    description: data.excerpt ?? '',
    keywords: data.tags,
    openGraph: {
      title: data.title,
      description: data.excerpt ?? '',
      type: 'article',
      publishedTime: data.created_at?.toISOString(),
      tags: data.tags ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.excerpt ?? '',
    },
  };
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post] = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
    .limit(1);

  if (!post) notFound();

  const article = post as unknown as Blog;
  const dateStr = article.created_at
    ? new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <main className="min-h-screen bg-[#050508] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Back nav */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          All articles
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {article.tags?.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r ${article.gradient} text-white text-xs font-semibold`}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {article.read_time && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={11} />
                {article.read_time}
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-gray-400 leading-relaxed mb-6">{article.excerpt}</p>
          )}

          <div className="flex items-center gap-3 pt-6 border-t border-white/8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Alex Morgan</div>
              <div className="text-xs text-gray-500">{dateStr}</div>
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className={`h-px bg-gradient-to-r ${article.gradient} opacity-30 mb-12`} />

        {/* Content */}
        {article.content ? (
          <div
            className="prose prose-invert prose-sm max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
              prose-code:text-violet-300 prose-code:bg-white/8 prose-code:rounded prose-code:px-1
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/8 prose-pre:rounded-xl
              prose-blockquote:border-violet-500 prose-blockquote:text-gray-400
              prose-strong:text-white prose-li:text-gray-300
              prose-img:rounded-xl prose-img:border prose-img:border-white/8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <div className="text-center py-20 text-gray-600">
            <p>Full article content coming soon.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to all articles
          </Link>
        </div>
      </div>
    </main>
  );
}
