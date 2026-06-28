'use client';

import { motion } from 'framer-motion';
import { Code2, Heart, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/6 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              dev<span className="gradient-text">.portfolio</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {['About', 'Projects', 'Contact', 'Blog'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-xs text-gray-500 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Credit */}
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            Built with <Heart size={12} className="text-rose-500 fill-rose-500" /> by Alex Morgan © {year}
          </p>
        </div>

        {/* Back to top */}
        <div className="flex justify-center mt-8">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors duration-200"
          >
            Back to top
            <ArrowUpRight size={12} />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
