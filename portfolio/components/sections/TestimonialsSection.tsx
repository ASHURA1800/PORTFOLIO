'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { testimonials as staticTestimonials } from '@/lib/data';
import type { Testimonial } from '@/types';

type TestimonialDisplay = {
  id: string | number;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
};

function normalizeTestimonial(t: Testimonial): TestimonialDisplay {
  return {
    id: t.id,
    name: t.name,
    role: t.role,
    avatar: t.avatar ?? t.name.slice(0, 2).toUpperCase(),
    text: t.feedback,
    rating: t.rating,
  };
}

export function TestimonialsSection() {
  const [items, setItems] = useState<TestimonialDisplay[]>(
    staticTestimonials.map((t, i) => ({ ...t, id: i }))
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch('/api/testimonials?limit=20')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.items.length > 0) {
          setItems(data.data.items.map((t: Testimonial) => normalizeTestimonial(t)));
        }
      })
      .catch(() => {});
  }, []);

  const prev = () => setActive((a) => (a - 1 + items.length) % items.length);
  const next = () => setActive((a) => (a + 1) % items.length);
  const t = items[active];

  if (!t) return null;

  return (
    <SectionWrapper id="testimonials" className="max-w-7xl mx-auto">
      <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-blue-600/8 blur-3xl rounded-full pointer-events-none" />

      <SectionHeader
        eyebrow="Social Proof"
        title="What people"
        titleHighlight="say"
        description="Feedback from engineers, founders, and product leads I've worked with."
      />

      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass border border-white/8 rounded-3xl p-8 md:p-12 relative overflow-hidden gradient-border"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-blue-600/5 pointer-events-none" />

              <div className="absolute top-6 right-8 opacity-10">
                <Quote size={80} className="text-violet-400" />
              </div>

              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light mb-8 relative">
                "{t.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-sm text-violet-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === active ? 'w-8 h-2 bg-violet-500' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/30 transition-all"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/30 transition-all"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
