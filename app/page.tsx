import { Metadata } from 'next';

import { CTASection } from '@/components/landing/cta-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HeroSection } from '@/components/landing/hero-section';
import { PricingPreviewSection } from '@/components/landing/pricing-preview-section';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'AI Stock Photo Tagging & Metadata Generator',
  description:
    'The complete tagging solution for Adobe Stock and Shutterstock. Perfect IPTC metadata, titles, and descriptions in seconds.',
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
