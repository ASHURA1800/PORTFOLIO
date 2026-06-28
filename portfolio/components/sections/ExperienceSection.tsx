'use client';

import { motion } from 'framer-motion';
import { Briefcase, Clock, MapPin } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { experience } from '@/lib/data';

const typeColors: Record<string, string> = {
  'full-time': 'from-violet-600/20 to-violet-600/5 border-violet-500/20',
  'contract': 'from-blue-600/20 to-blue-600/5 border-blue-500/20',
  'internship': 'from-teal-600/20 to-teal-600/5 border-teal-500/20',
};

const typeLabels: Record<string, string> = {
  'full-time': 'Full-time',
  'contract': 'Contract',
  'internship': 'Internship',
};

const typeBadgeColors: Record<string, string> = {
  'full-time': 'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  'contract': 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  'internship': 'bg-teal-500/15 text-teal-300 border border-teal-500/25',
};

export function ExperienceSection() {
  return (
    <SectionWrapper id="experience" className="max-w-5xl mx-auto">
      <div className="absolute left-1/4 top-0 w-80 h-80 bg-violet-600/6 blur-3xl rounded-full pointer-events-none" />

      <SectionHeader
        eyebrow="Experience"
        title="Work"
        titleHighlight="History"
        description="My professional journey — from intern to senior engineer, building things that matter."
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-600 via-blue-600/50 to-transparent" />

        <div className="space-y-8">
          {experience.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-6 md:gap-8 group"
            >
              {/* Node */}
              <div className="relative flex-shrink-0">
                <motion.div
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/20 flex items-center justify-center z-10 relative group-hover:border-violet-500/40 transition-colors duration-300"
                >
                  <Briefcase size={18} className="text-violet-400" />
                </motion.div>
              </div>

              {/* Card */}
              <div className={`flex-1 glass border rounded-2xl p-5 md:p-6 bg-gradient-to-br ${typeColors[job.type]} group-hover:shadow-lg group-hover:shadow-violet-500/8 transition-all duration-300 mb-2`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white">{job.role}</h3>
                    <p className="text-violet-400 text-sm font-semibold mt-0.5">{job.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeBadgeColors[job.type]}`}>
                      {typeLabels[job.type]}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={11} />
                      {job.period}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={11} />
                      {job.location}
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {job.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
