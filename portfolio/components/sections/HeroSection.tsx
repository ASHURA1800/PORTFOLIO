'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Link, Rss, MessageCircle, Mail, ArrowDown, Download, ExternalLink, ChevronRight } from 'lucide-react';
import { roles } from '@/lib/data';
import { useAnalytics } from '@/hooks/useAnalytics';

function FloatingShape({ delay = 0, x = 0, y = 0, size = 300, color = 'purple' }: {
  delay?: number; x?: number; y?: number; size?: number; color?: string;
}) {
  const colors = {
    purple: 'from-violet-600/20 to-purple-600/5',
    blue: 'from-blue-600/20 to-cyan-600/5',
    pink: 'from-pink-600/15 to-rose-600/5',
  };
  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-br ${colors[color as keyof typeof colors]} blur-3xl pointer-events-none`}
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -20, 30, 0],
        scale: [1, 1.1, 0.95, 1],
        opacity: [0.6, 0.9, 0.5, 0.6],
      }}
      transition={{
        duration: 10 + delay * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

function TypewriterRole() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < role.length) {
        timeout = setTimeout(() => setDisplayText(role.slice(0, displayText.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40);
      } else {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex]);

  return (
    <span className="gradient-text">
      {displayText}
      <span className="cursor-blink text-violet-400 ml-0.5">|</span>
    </span>
  );
}

const socialIcons = [
  { icon: Link, href: 'https://github.com', label: 'GitHub' },
  { icon: Rss, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: MessageCircle, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Mail, href: 'mailto:dev@example.com', label: 'Email' },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const { trackResumeDownload, track } = useAnalytics();

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-60" />

      <FloatingShape delay={0} x={-5} y={10} size={500} color="purple" />
      <FloatingShape delay={2} x={70} y={5} size={400} color="blue" />
      <FloatingShape delay={4} x={40} y={60} size={350} color="pink" />
      <FloatingShape delay={1} x={80} y={50} size={250} color="purple" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12)_0%,transparent_65%)] pointer-events-none" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-6xl mx-auto w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/20 text-xs font-medium text-violet-300 mb-8 shadow-lg shadow-violet-500/10"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-sm shadow-green-400/50" />
          Available for opportunities
          <ChevronRight size={12} className="text-violet-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9] mb-4">
            <span className="block text-white">Alex</span>
            <span className="block text-glow" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 40%, #818cf8 70%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Morgan
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-300 mb-6 h-10 flex items-center justify-center gap-3"
        >
          <span className="text-gray-500">&gt;_</span>
          <TypewriterRole />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10"
        >
          I craft high-performance web applications and AI-powered products that solve real problems.
          From idea to production — I build software that scales, delights, and endures.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <motion.a
            href="#contact"
            onClick={() => track('page_view', { section: 'contact_cta' })}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow duration-300 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Mail size={16} />
            Hire Me
          </motion.a>
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-xl glass border border-white/10 hover:border-violet-500/30 text-white text-sm font-semibold transition-all duration-300 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ExternalLink size={16} />
            View Work
          </motion.a>
          <motion.button
            onClick={trackResumeDownload}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all duration-300 inline-flex items-center gap-2 w-full sm:w-auto justify-center border border-transparent hover:border-white/10"
          >
            <Download size={16} />
            Resume
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 mb-16"
        >
          {socialIcons.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              onClick={() => track('github_click', { platform: label })}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/15 transition-all duration-300"
            >
              <Icon size={17} />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-8 sm:gap-12"
        >
          {[
            { value: '3+', label: 'Years Exp.' },
            { value: '20+', label: 'Projects' },
            { value: '8+', label: 'Tech Stacks' },
            { value: '100%', label: 'Committed' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs tracking-widest uppercase">scroll</span>
        <div className="scroll-bounce">
          <ArrowDown size={16} />
        </div>
      </motion.div>
    </section>
  );
}
