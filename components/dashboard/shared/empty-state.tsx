import Link from 'next/link';

import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-6">
        <Upload className="text-muted-foreground h-12 w-12" />
      </div>
      <h3 className="mb-2 text-2xl font-semibold">No images yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Upload your first image and start AI auto-tagging
      </p>
      <Button size="lg" asChild>
        <Link href="/dashboard/upload">Upload your first image</Link>
      </Button>
    </div>
  );
}
