'use client';

import { motion, AnimatePresence } from 'framer-motion';

export interface SlideContent {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  bgGradient: string;
}

interface CarouselSlideProps {
  slide: SlideContent;
  direction: 'forward' | 'backward';
}

const variants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? '-100%' : '100%',
    opacity: 0,
  }),
};

const transition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export function CarouselSlide({ slide, direction }: CarouselSlideProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slide.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
        className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
      >
        {/* Icon area */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
          className={`mb-8 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl shadow-lg ${slide.bgGradient}`}
        >
          {slide.emoji}
        </motion.div>

        {/* Subtitle pill */}
        <motion.span
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22 }}
          className={`mb-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${slide.accentColor}`}
        >
          {slide.subtitle}
        </motion.span>

        {/* Title */}
        <motion.h2
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white"
        >
          {slide.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.34 }}
          className="max-w-xs text-base leading-relaxed text-white/70"
        >
          {slide.description}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
