'use client';

import { motion } from 'framer-motion';
import { GitBranch, GitCommitHorizontal, Flame, Star, GitFork } from "lucide-react";
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';

const topLanguages = [
  { name: 'TypeScript', percent: 38, color: 'bg-blue-500' },
  { name: 'Python', percent: 25, color: 'bg-yellow-500' },
  { name: 'JavaScript', percent: 18, color: 'bg-yellow-400' },
  { name: 'CSS', percent: 10, color: 'bg-pink-500' },
  { name: 'Other', percent: 9, color: 'bg-gray-500' },
];

const statCards = [
  { icon: GitCommitHorizontal, value: '1,240+', label: 'Total Commits', color: 'text-violet-400' },
  { icon: Star, value: '320+', label: 'Stars Earned', color: 'text-yellow-400' },
  { icon: GitFork, value: '85+', label: 'Forks', color: 'text-blue-400' },
  { icon: Flame, value: '47', label: 'Day Streak', color: 'text-orange-400' },
];

// Fake contribution grid
function ContributionGrid() {
  const weeks = 26;
  const days = 7;
  const intensities = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4];

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1 min-w-max">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, d) => {
              const intensity = intensities[Math.floor(Math.random() * intensities.length)];
              const colors = [
                'bg-white/5',
                'bg-violet-900/60',
                'bg-violet-700/70',
                'bg-violet-500/80',
                'bg-violet-400',
              ];
              return (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (w * 7 + d) * 0.002 }}
                  className={`w-3 h-3 rounded-sm ${colors[intensity]} hover:ring-1 hover:ring-violet-400 cursor-default transition-all`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GitHubStatsSection() {
  return (
    <SectionWrapper id="github" className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Open Source"
        title="GitHub"
        titleHighlight="Activity"
        description="Building in public. Here's a snapshot of my development activity over the past 6 months."
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass border border-white/6 rounded-2xl p-5 text-center glass-hover group"
          >
            <s.icon size={22} className={`${s.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
            <div className="text-2xl font-black text-white mb-1">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contribution graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 glass border border-white/6 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <GitBranch size={18} className="text-gray-400" />
            <span className="text-sm font-semibold text-white">Contribution Activity</span>
            <span className="ml-auto text-xs text-gray-500">Last 6 months</span>
          </div>
          <ContributionGrid />
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-xs text-gray-600">Less</span>
            {['bg-white/5', 'bg-violet-900/60', 'bg-violet-700/70', 'bg-violet-500/80', 'bg-violet-400'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-xs text-gray-600">More</span>
          </div>
        </motion.div>

        {/* Top languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass border border-white/6 rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            Top Languages
          </h3>

          {/* Donut */}
          <div className="relative mb-5">
            <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto -rotate-90">
              {(() => {
                let offset = 0;
                const colors = ['#8b5cf6', '#eab308', '#facc15', '#ec4899', '#6b7280'];
                return topLanguages.map((lang, i) => {
                  const dashArray = lang.percent;
                  const el = (
                    <circle
                      key={lang.name}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors[i]}
                      strokeWidth="12"
                      strokeDasharray={`${dashArray} ${100 - dashArray}`}
                      strokeDashoffset={100 - offset}
                      opacity={0.85}
                    />
                  );
                  offset += lang.percent;
                  return el;
                });
              })()}
            </svg>
          </div>

          <div className="space-y-3">
            {topLanguages.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${lang.color} flex-shrink-0`} />
                <span className="text-xs text-gray-300 flex-1">{lang.name}</span>
                <span className="text-xs font-bold gradient-text">{lang.percent}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
