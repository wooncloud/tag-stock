'use client';

import dynamic from 'next/dynamic';

const OAuthButtons = dynamic(
  () => import('./oauth-buttons').then((mod) => ({ default: mod.OAuthButtons })),
  { ssr: false }
);

export function OAuthButtonsWrapper() {
  return <OAuthButtons />;
}
