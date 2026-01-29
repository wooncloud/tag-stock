'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Chromium } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ExtensionSection() {
  return (
    <section id="extension" className="relative bg-background border-t py-24 overflow-hidden">
      {/* Chrome 3D Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full opacity-30">
          <Image
            src="/images/chrome.webp"
            alt="Chrome 3D Background"
            fill
            className="object-cover object-right"
            priority={false}
          />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/95 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-purple-200 bg-transparent px-3 py-1 text-sm font-medium text-purple-600 dark:border-purple-800">
              <Chromium className="mr-2 h-4 w-4" />
              Chrome Extension
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Apply Metadata Directly on Stock Sites
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              Use our Chrome Extension to instantly search and apply image metadata directly on the
              upload screens of various stock sites, including Adobe Stock and Shutterstock.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="#">Install Chrome Extension</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Card className="border-purple-100 bg-purple-50/50 dark:border-purple-900/20 dark:bg-purple-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Exclusive for Pro Plan</CardTitle>
                <CardDescription>
                  Subscribe to the Pro plan to enjoy unlimited AI tagging and access to our powerful
                  Chrome Extension features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    Automatic integration with stock site upload pages
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    Copy and paste keywords and titles with one click
                  </li>
                  <li className="flex items-center">
                    <div className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    Full support for Adobe Stock & Shutterstock
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
