'use client';

import { OAuthButtonsWrapper } from '@/components/auth/oauth-buttons-wrapper';

export function CTASection() {
  return (
    <section className="border-t bg-linear-to-br from-purple-600 to-pink-600">
      <div className="container mx-auto px-4 py-24 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl">Start Now</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
          Sign up in seconds and experience AI auto-tagging for free
        </p>
        <div className="flex justify-center">
          <div className="rounded-lg bg-white p-2 dark:bg-zinc-900">
            <OAuthButtonsWrapper />
          </div>
        </div>
      </div>
    </section>
  );
}
