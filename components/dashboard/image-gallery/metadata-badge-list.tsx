'use client';

import { Check, Copy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MetadataBadgeListProps {
  label: string;
  items: string[];
  onCopy: () => void;
  copied: boolean;
  variant: 'outline' | 'secondary';
}

export function MetadataBadgeList({
  label,
  items,
  onCopy,
  copied,
  variant,
}: MetadataBadgeListProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Button variant="ghost" size="sm" className="cursor-pointer" onClick={onCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items?.map((item, i) => (
          <Badge key={i} variant={variant}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
