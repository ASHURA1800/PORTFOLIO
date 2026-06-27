'use client';

import { motion } from 'framer-motion';
import { Code, ExternalLink, ArrowUpRight } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { projects } from '@/lib/data';

const projectEmojis: Record<string, string> = {
  FinTech: '💰',
  EdTech: '📚',
  'AI/ML': '🤖',
  'Dev Tools': '⚡',
};

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative glass border border-white/6 rounded-2xl overflow-hidden hover:border-white/12 transition-all duration-500"
      whileHover={{ y: -6, scale: 1.01 }}
    >
      {/* Hover glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />

      {/* Gradient thumbnail */}
      <div className={`relative h-48 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        {/* Floating project icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl filter drop-shadow-2xl"
          >
            {projectEmojis[project.category]}
          </motion.div>
        </div>
        {/* Category badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 text-white text-xs font-medium">
            {project.category}
          </span>
        </div>
        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-violet-400 font-medium mt-0.5">{project.subtitle}</p>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-400 hover:text-white hover:border-violet-500/30 transition-all duration-200 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/6">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 py-2.5 rounded-xl glass border border-white/8 hover:border-violet-500/30 text-gray-300 hover:text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Code size={15} />
            GitHub
          </motion.a>
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${project.gradient} text-white text-sm font-medium inline-flex items-center justify-center gap-2 shadow-lg transition-all duration-300`}
          >
            <ExternalLink size={15} />
            Live Demo
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <SectionWrapper id="projects" className="max-w-7xl mx-auto">
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-pink-600/8 blur-3xl rounded-full pointer-events-none" />

      <SectionHeader
        eyebrow="My Work"
        title="Featured"
        titleHighlight="Projects"
        description="A selection of projects I've built — from AI-powered platforms to developer tools. Each one shipped to production."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {/* View more */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mt-12"
      >
        <motion.a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass border border-white/10 hover:border-violet-500/30 text-gray-300 hover:text-white text-sm font-medium transition-all duration-300"
        >
          <Code size={16} />
          View All on GitHub
          <ArrowUpRight size={16} />
        </motion.a>
      </motion.div>
    </SectionWrapper>
  );
}
