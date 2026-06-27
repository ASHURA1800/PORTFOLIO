'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn('relative py-24 px-4 md:px-8 overflow-hidden', className)}
    >
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({ eyebrow, title, titleHighlight, description, centered = true }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn('mb-16', centered && 'text-center')}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-violet-500" />
          <span className="text-violet-400 text-xs uppercase tracking-[0.25em] font-semibold">{eyebrow}</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-violet-500" />
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
        {title}{' '}
        {titleHighlight && (
          <span className="gradient-text">{titleHighlight}</span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
