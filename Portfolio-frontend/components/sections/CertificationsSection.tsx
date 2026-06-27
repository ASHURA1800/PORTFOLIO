'use client';

import { motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { certifications } from '@/lib/data';

export function CertificationsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  return (
    <SectionWrapper id="certifications" className="max-w-7xl mx-auto">
      <div className="absolute left-0 bottom-0 w-80 h-80 bg-amber-600/6 blur-3xl rounded-full pointer-events-none" />

      <SectionHeader
        eyebrow="Credentials"
        title="Certifications &"
        titleHighlight="Achievements"
        description="Verified expertise across cloud platforms, frameworks, and development practices."
      />

      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all duration-200 hover:border-violet-500/30"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-all duration-200 hover:border-violet-500/30"
        >
          <ChevronRight size={18} />
        </button>

        {/* Slider */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex-shrink-0 w-64 glass border border-white/6 rounded-2xl p-5 hover:border-violet-500/25 transition-all duration-300 group cursor-default"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {cert.icon}
                </div>
                <Award size={16} className="text-amber-400 mt-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">{cert.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{cert.issuer}</p>
              <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                {cert.year}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050508] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050508] to-transparent pointer-events-none" />
      </div>
    </SectionWrapper>
  );
}
