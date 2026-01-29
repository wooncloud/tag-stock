import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Vortex } from '@/components/ui/vortex';

import { HeroCompareDemo } from '@/components/landing/hero-compare-demo';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Vortex background effect */}
      <div className="pointer-events-none absolute inset-0">
        <Vortex
          backgroundColor="transparent"
          rangeY={800}
          particleCount={100}
          baseHue={270}
          className="h-full w-full"
          containerClassName="w-full h-full"
          rangeRadius={3}
          baseRadius={1.5}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text pb-1 text-4xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none">
                Automatically generate stock photo metadata with AI
              </h1>
              <p className="text-muted-foreground max-w-[600px] md:text-xl">
                The complete tagging solution for Adobe Stock and Shutterstock. Our advanced AI
                generates accurate keywords and descriptions in seconds.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-purple-600">Experience it now</p>
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/login">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <HeroCompareDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
