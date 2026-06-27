'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  target?: string;
}

export function Button({ children, variant = 'primary', size = 'md', className, href, onClick, icon, target }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-300 cursor-pointer select-none';

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
    secondary: 'glass text-white hover:border-violet-500/40',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    glow: 'bg-gradient-to-r from-violet-600 to-blue-600 text-white glow-purple hover:glow-blue',
  };

  const classes = cn(base, sizes[size], variants[variant], className);

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        className={classes}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}
