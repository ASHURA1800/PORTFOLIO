'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { skills } from '@/lib/data';

const categoryColors: Record<string, string> = {
  Frontend: 'from-violet-600 to-purple-600',
  Backend: 'from-blue-600 to-cyan-600',
  AI: 'from-pink-600 to-rose-600',
  Database: 'from-amber-500 to-orange-600',
  DevOps: 'from-teal-500 to-green-600',
  Mobile: 'from-indigo-600 to-blue-700',
};

const categoryGlows: Record<string, string> = {
  Frontend: 'shadow-violet-500/20',
  Backend: 'shadow-blue-500/20',
  AI: 'shadow-pink-500/20',
  Database: 'shadow-amber-500/20',
  DevOps: 'shadow-teal-500/20',
  Mobile: 'shadow-indigo-500/20',
};

const categoryIcons: Record<string, string> = {
  Frontend: '⚛️',
  Backend: '🔧',
  AI: '🤖',
  Database: '🗄️',
  DevOps: '🐳',
  Mobile: '📱',
};

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('Frontend');
  const categories = Object.keys(skills);
  const activeSkills = skills[activeCategory as keyof typeof skills];

  return (
    <SectionWrapper id="skills" className="max-w-7xl mx-auto">
      <div className="absolute left-0 top-1/3 w-80 h-80 bg-blue-600/8 blur-3xl rounded-full pointer-events-none" />

      <SectionHeader
        eyebrow="Tech Stack"
        title="Skills &"
        titleHighlight="Technologies"
        description="A curated toolkit built through years of shipping real products in fast-paced environments."
      />

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'text-white shadow-lg ' + categoryGlows[cat]
                : 'glass border border-white/6 text-gray-400 hover:text-white hover:border-white/12'
            }`}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="skill-active-bg"
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${categoryColors[cat]}`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <span>{categoryIcons[cat]}</span>
              {cat}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Skills grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        {activeSkills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="glass border border-white/6 rounded-xl p-5 group glass-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">{skill.name}</span>
              <span className="text-xs font-bold gradient-text">{skill.level}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ delay: i * 0.06 + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${categoryColors[activeCategory]}`}
              />
            </div>

            {/* Level label */}
            <div className="mt-2 text-xs text-gray-500">
              {skill.level >= 90 ? 'Expert' : skill.level >= 80 ? 'Advanced' : skill.level >= 70 ? 'Proficient' : 'Familiar'}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* All tech icons strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16"
      >
        <p className="text-center text-xs text-gray-600 uppercase tracking-widest mb-6">All Technologies</p>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.values(skills).flat().map((skill, i) => (
            <motion.span
              key={`${skill.name}-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ scale: 1.08, y: -2 }}
              className="px-3 py-1.5 rounded-lg glass border border-white/6 text-xs text-gray-400 hover:text-white hover:border-violet-500/30 cursor-default transition-all duration-200"
            >
              {skill.name}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
