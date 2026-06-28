'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Coffee, Zap } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { fadeInUp, staggerContainer } from '@/lib/utils';

const timeline = [
  { year: '2020', event: 'Started coding journey with JavaScript & Python', icon: '🚀' },
  { year: '2021', event: 'First internship — built production features', icon: '💼' },
  { year: '2022', event: 'Went full stack, shipped 3 SaaS products', icon: '⚡' },
  { year: '2023', event: 'Dove deep into AI/ML & LLM integrations', icon: '🤖' },
  { year: '2024', event: 'Senior engineer role, leading architecture decisions', icon: '🏗️' },
  { year: '2025', event: 'Building FinTech & AI tools at scale', icon: '🌐' },
];

const facts = [
  { icon: MapPin, label: 'Based in', value: 'Lagos, Nigeria 🇳🇬' },
  { icon: Calendar, label: 'Experience', value: '3+ Years' },
  { icon: Coffee, label: 'Fuel', value: 'Coffee & curiosity' },
  { icon: Zap, label: 'Specialty', value: 'AI × FinTech' },
];

export function AboutSection() {
  return (
    <SectionWrapper id="about" className="max-w-7xl mx-auto">
      {/* Background gradient */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-violet-600/8 blur-3xl rounded-full pointer-events-none" />

      <SectionHeader
        eyebrow="About Me"
        title="Crafting digital"
        titleHighlight="experiences"
        description="I'm a software engineer passionate about building products at the intersection of performance, design, and intelligence."
      />

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Profile + Facts */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
        >
          {/* Profile card */}
          <motion.div
            variants={fadeInUp}
            className="glass border border-white/6 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-blue-600/5" />
            <div className="relative flex items-start gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-violet-500/30">
                  AM
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-[#050508] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Alex Morgan</h3>
                <p className="text-violet-400 text-sm font-medium mt-0.5">Senior Full Stack Engineer</p>
                <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                  Building AI-powered products that ship fast, scale hard, and look great.
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5 space-y-3 text-gray-300 text-sm leading-relaxed">
              <p>
                I'm a full-stack engineer and AI builder who loves turning complex ideas into
                elegant, high-performance software. My work spans FinTech, EdTech, and developer tooling.
              </p>
              <p>
                When I'm not writing code, I'm exploring Linux internals, contributing to open source,
                or writing about the technical challenges I've solved — because building in public is how
                we all get better.
              </p>
            </div>
          </motion.div>

          {/* Facts grid */}
          <div className="grid grid-cols-2 gap-3">
            {facts.map((fact, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass border border-white/6 rounded-xl p-4 glass-hover group"
              >
                <fact.icon size={16} className="text-violet-400 mb-2 group-hover:text-violet-300 transition-colors" />
                <div className="text-xs text-gray-500 mb-0.5">{fact.label}</div>
                <div className="text-sm text-white font-medium">{fact.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
            {[
              { value: '20+', label: 'Projects' },
              { value: '3+', label: 'Years' },
              { value: '8+', label: 'Stacks' },
            ].map((s, i) => (
              <div key={i} className="glass border border-white/6 rounded-xl p-4 text-center">
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            My Journey
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-600 via-blue-600/50 to-transparent" />

            <div className="space-y-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex gap-4 group"
                >
                  {/* Node */}
                  <div className="relative flex-shrink-0 w-11 h-11 rounded-xl glass border border-white/8 flex items-center justify-center text-lg group-hover:border-violet-500/30 transition-colors duration-300 z-10">
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div className="glass border border-white/6 rounded-xl p-4 flex-1 group-hover:border-violet-500/20 transition-all duration-300 group-hover:bg-white/4">
                    <div className="text-xs text-violet-400 font-semibold mb-1">{item.year}</div>
                    <div className="text-sm text-gray-200 leading-relaxed">{item.event}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
