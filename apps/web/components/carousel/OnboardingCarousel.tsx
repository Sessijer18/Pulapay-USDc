'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { CarouselSlide, type SlideContent } from './CarouselSlide';
import { useCarousel } from './useCarousel';

const SLIDES: SlideContent[] = [
  {
    id: 'one-balance',
    emoji: '💰',
    title: 'Un compte.\nToute l'Afrique.',
    subtitle: 'Bienvenue',
    description:
      'Mobile Money, carte bancaire, USDC — tout dans un seul solde. Simple comme envoyer un message.',
    accentColor: 'bg-emerald-500/20 text-emerald-300',
    bgGradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  },
  {
    id: 'send-instantly',
    emoji: '⚡',
    title: 'Envoyez en\nquelques secondes.',
    subtitle: 'Transferts',
    description:
      'Numéro de téléphone ou QR code. L'argent arrive instantanément, peu importe l'opérateur.',
    accentColor: 'bg-violet-500/20 text-violet-300',
    bgGradient: 'bg-gradient-to-br from-violet-500 to-purple-700',
  },
  {
    id: 'mobile-money',
    emoji: '📱',
    title: 'MTN, Moov,\nCeltiis. Tout.',
    subtitle: 'Mobile Money',
    description:
      'Rechargez depuis n'importe quel opérateur. Retirez vers votre Mobile Money préféré.',
    accentColor: 'bg-yellow-500/20 text-yellow-300',
    bgGradient: 'bg-gradient-to-br from-yellow-500 to-orange-600',
  },
  {
    id: 'stablecoin',
    emoji: '🌐',
    title: 'USDC invisible,\npuissance réelle.',
    subtitle: 'Stablecoin',
    description:
      'Nous utilisons l'USDC en coulisses pour des règlements rapides et peu coûteux. Vous, vous ne voyez que votre solde.',
    accentColor: 'bg-sky-500/20 text-sky-300',
    bgGradient: 'bg-gradient-to-br from-sky-500 to-blue-700',
  },
  {
    id: 'security',
    emoji: '🔐',
    title: 'Vos fonds.\nVotre contrôle.',
    subtitle: 'Sécurité',
    description:
      'Wallets MPC non-custodial. Vos clés ne sont jamais en un seul endroit. Pulapay ne peut pas toucher à votre argent.',
    accentColor: 'bg-rose-500/20 text-rose-300',
    bgGradient: 'bg-gradient-to-br from-rose-500 to-pink-700',
  },
];

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const { current, direction, goTo, next, prev, isFirst, isLast } = useCarousel({
    total: SLIDES.length,
  });

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      next();
    }
  }, [isLast, next, onComplete]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0f]">
      {/* Background glow */}
      <motion.div
        key={current}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: glowColor(current),
            opacity: 0.18,
          }}
        />
      </motion.div>

      {/* Skip button */}
      {!isLast && (
        <button
          onClick={onComplete}
          className="absolute right-6 top-6 z-10 rounded-full px-4 py-1.5 text-sm font-medium text-white/50 transition hover:text-white/80"
        >
          Passer
        </button>
      )}

      {/* Slides */}
      <div className="relative flex-1">
        <CarouselSlide slide={SLIDES[current]} direction={direction} />
      </div>

      {/* Bottom controls */}
      <div className="z-10 flex flex-col items-center gap-6 pb-14">
        {/* Dot indicators */}
        <div className="flex gap-2" role="tablist" aria-label="Slides">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{
                width: i === current ? 24 : 8,
                background: i === current ? '#fff' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex w-full max-w-xs items-center gap-3 px-6">
          {!isFirst && (
            <button
              onClick={prev}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10"
              aria-label="Précédent"
            >
              ←
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-white font-semibold text-black transition hover:bg-white/90 active:scale-95"
          >
            {isLast ? 'Commencer →' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}

function glowColor(index: number): string {
  const colors = [
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#f59e0b', // yellow
    '#0ea5e9', // sky
    '#f43f5e', // rose
  ];
  return colors[index] ?? '#10b981';
}
