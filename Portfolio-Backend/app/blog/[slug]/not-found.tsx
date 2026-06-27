import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function BlogNotFound() {
  return (
    <main className="min-h-screen bg-[#050508] text-white flex items-center justify-center px-6">
      <div className="text-center">
        <FileQuestion size={64} className="mx-auto mb-6 text-gray-700" />
        <h1 className="text-3xl font-black text-white mb-3">Article Not Found</h1>
        <p className="text-gray-500 mb-8">
          This article doesn't exist or hasn't been published yet.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 hover:border-violet-500/30 text-gray-300 hover:text-white text-sm font-medium transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Back to articles
        </Link>
      </div>
    </main>
  );
}
