'use client';

import { FileImage, Sparkles, Zap } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl">
            Powerful Features
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            AI-powered metadata generation tools for professional photographers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Sparkles className="mb-2 h-10 w-10 text-purple-600" />}
            title="AI Auto-Tagging"
            description="Generate accurate keywords using our advanced AI model"
          />
          <FeatureCard
            icon={<FileImage className="mb-2 h-10 w-10 text-blue-600" />}
            title="IPTC Metadata"
            description="Embed metadata directly into images with the Pro plan"
          />
          <FeatureCard
            icon={<Zap className="mb-2 h-10 w-10 text-yellow-600" />}
            title="Multi-Image"
            description="Upload and batch process multiple images at once"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        {icon}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
