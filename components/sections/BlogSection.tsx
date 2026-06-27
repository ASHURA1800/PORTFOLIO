'use client';

import { motion } from 'framer-motion';
import { Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { blogPosts } from '@/lib/data';

export function BlogSection() {
  return (
    <SectionWrapper id="blog" className="max-w-7xl mx-auto">
      <div className="absolute left-0 top-0 w-80 h-80 bg-teal-600/6 blur-3xl rounded-full pointer-events-none" />

      <SectionHeader
        eyebrow="Writing"
        title="Latest"
        titleHighlight="Articles"
        description="I write about engineering challenges, AI development, and things I learn while building."
      />

      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {blogPosts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group glass border border-white/6 rounded-2xl overflow-hidden hover:border-white/12 transition-all duration-500"
            whileHover={{ y: -5 }}
          >
            {/* Gradient header */}
            <div className={`h-2 bg-gradient-to-r ${post.gradient}`} />

            <div className="p-6">
              {/* Tag & read time */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${post.gradient} text-white text-xs font-semibold`}>
                  {post.tag}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                  <Clock size={11} />
                  {post.readTime}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white leading-snug mb-3 group-hover:text-violet-300 transition-colors duration-300 line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-gray-400 leading-relaxed mb-5 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/6">
                <span className="text-xs text-gray-600">{post.date}</span>
                <motion.a
                  href="#"
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  Read more
                  <ArrowUpRight size={12} />
                </motion.a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center mt-10"
      >
        <motion.a
          href="#"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl glass border border-white/10 hover:border-violet-500/30 text-gray-300 hover:text-white text-sm font-medium transition-all duration-300"
        >
          <BookOpen size={16} />
          All Articles
          <ArrowUpRight size={14} />
        </motion.a>
      </motion.div>
    </SectionWrapper>
  );
}
