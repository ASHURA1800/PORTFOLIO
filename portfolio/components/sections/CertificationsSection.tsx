'use client';

import { motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { certifications as staticCerts } from '@/lib/data';
import type { Certification } from '@/types';

type CertDisplay = {
  id: string | number;
  title: string;
  issuer: string;
  year: string;
  icon: string;
  credential_url?: string;
};

function normalizeCert(c: Certification): CertDisplay {
  return {
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    year: c.issued_date ? new Date(c.issued_date).getFullYear().toString() : '',
    icon: c.icon,
    credential_url: c.credential_url,
  };
}

export function CertificationsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [certs, setCerts] = useState<CertDisplay[]>(
    staticCerts.map((c, i) => ({ id: i, title: c.title, issuer: c.issuer, year: c.year, icon: c.icon }))
  );

  useEffect(() => {
    fetch('/api/certifications?limit=20')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.items.length > 0) {
          setCerts(data.data.items.map((c: Certification) => normalizeCert(c)));
        }
      })
      .catch(() => {});
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
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

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {certs.map((cert, i) => (
            <motion.div
              key={cert.id}
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
              {cert.year && (
                <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                  {cert.year}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050508] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050508] to-transparent pointer-events-none" />
      </div>
    </SectionWrapper>
  );
}
