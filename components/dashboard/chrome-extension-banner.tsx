import { Chrome } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ChromeExtensionBanner() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-4">
          <Chrome className="h-10 w-10 shrink-0" />
          <div>
            <h3 className="text-lg font-semibold">Chrome Extension</h3>
            <p className="text-muted-foreground text-sm">
              Install the extension to auto-generate metadata on Adobe Stock & Shutterstock
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
