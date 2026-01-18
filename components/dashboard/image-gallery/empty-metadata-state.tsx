'use client';

import { RefreshCw } from 'lucide-react';

export function EmptyMetadataState() {
  return (
    <div className="text-muted-foreground bg-muted/30 rounded-lg border border-dashed py-8 text-center">
      <RefreshCw className="mx-auto mb-2 h-8 w-8 animate-spin opacity-20" />
      <p className="text-sm">AI is analyzing your image or no metadata found...</p>
      <p className="text-muted-foreground mt-1 text-xs">Please wait a few seconds and refresh.</p>
    </div>
  );
}
