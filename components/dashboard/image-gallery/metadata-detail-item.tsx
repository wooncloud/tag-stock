'use client';

import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface MetadataDetailItemProps {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}

export function MetadataDetailItem({ label, value, copied, onCopy }: MetadataDetailItemProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Button variant="ghost" size="sm" className="cursor-pointer" onClick={onCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <p className="bg-muted rounded p-2 text-sm">{value}</p>
    </div>
  );
}
