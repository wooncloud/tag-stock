'use client';

import React, { useCallback, useRef, useState } from 'react';

import Image from 'next/image';

import { IconDotsVertical } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

const DEMO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

const DEMO_TAGS = [
  { label: 'mountain', x: 15, y: 20 },
  { label: 'landscape', x: 60, y: 15 },
  { label: 'nature', x: 25, y: 75 },
  { label: 'sunrise', x: 70, y: 65 },
  { label: 'scenic', x: 45, y: 45 },
];

const DEMO_METADATA = {
  title: 'Majestic Mountain Sunrise Over Alpine Valley',
  description:
    'Breathtaking aerial view of snow-capped mountains at golden hour with misty valleys below',
};

export function HeroCompareDemo() {
  const [sliderXPercent, setSliderXPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (isHovering || isDragging) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [isHovering, isDragging]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => handleMove(e.clientX), [handleMove]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => handleMove(e.touches[0].clientX),
    [handleMove]
  );

  return (
    <div
      ref={sliderRef}
      className={cn(
        'relative aspect-4/3 w-full max-w-[600px] cursor-col-resize overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl backdrop-blur-sm',
        'ring-1 ring-purple-500/20'
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsDragging(false);
      }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
    >
      {/* Background: After (with tags) - Always visible */}
      <div className="absolute inset-0">
        <Image
          src={DEMO_IMAGE}
          alt="After: With AI metadata"
          fill
          className="object-cover"
          draggable={false}
          priority
        />
        {/* Floating Tags */}
        <AnimatePresence>
          {DEMO_TAGS.map((tag, i) => (
            <motion.div
              key={tag.label}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="absolute"
              style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
            >
              <span className="inline-flex items-center rounded-full bg-purple-600/90 px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
                {tag.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Metadata Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-4 pt-16">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm font-semibold text-white md:text-base"
          >
            {DEMO_METADATA.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-1 text-xs text-white/70 md:text-sm"
          >
            {DEMO_METADATA.description}
          </motion.p>
        </div>
      </div>

      {/* Foreground: Before (plain) - Clipped */}
      <motion.div
        className="absolute inset-0 z-20"
        style={{
          clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
        }}
        transition={{ duration: 0 }}
      >
        <Image
          src={DEMO_IMAGE}
          alt="Before: Original"
          fill
          className="object-cover"
          draggable={false}
          priority
        />
        {/* "Before" Label */}
        <div className="absolute top-4 left-4">
          <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
            Original
          </span>
        </div>
      </motion.div>

      {/* "After" Label */}
      <div className="absolute top-4 right-4 z-10">
        <span className="rounded-md bg-purple-600/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          AI Tagged
        </span>
      </div>

      {/* Slider Line */}
      <motion.div
        className="absolute top-0 z-30 m-auto h-full w-px bg-linear-to-b from-transparent via-white to-transparent"
        style={{
          left: `${sliderXPercent}%`,
        }}
        transition={{ duration: 0 }}
      >
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-0 h-full w-20 -translate-y-1/2 bg-linear-to-r from-purple-500/30 via-transparent to-transparent mask-[radial-gradient(60px_at_left,white,transparent)] opacity-50" />

        {/* Handle */}
        <div className="absolute top-1/2 -right-2.5 z-30 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md bg-white shadow-lg">
          <IconDotsVertical className="h-4 w-4 text-gray-600" />
        </div>
      </motion.div>

      {/* Instructions */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center pb-2">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 0 : 0.7 }}
          className="rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm"
        >
          Drag to compare
        </motion.span>
      </div>
    </div>
  );
}
