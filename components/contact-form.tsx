'use client';

import { useState, useTransition } from 'react';

import { CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import { type ContactType, contactTypeLabels, contactTypes } from '@/lib/validations/contact';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { submitContact } from '@/app/actions/contact';

interface FieldErrors {
  email?: string[];
  type?: string[];
  subject?: string[];
  message?: string[];
}

interface FormData {
  email: string;
  type: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  email: '',
  type: '',
  subject: '',
  message: '',
};

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const data = new FormData();
    data.append('email', formData.email);
    data.append('type', formData.type);
    data.append('subject', formData.subject);
    data.append('message', formData.message);

    startTransition(async () => {
      const result = await submitContact(data);

      if (result.success) {
        setIsSuccess(true);
        setFormData(initialFormData);
        toast.success('Message sent successfully!', {
          description: "We'll get back to you within 24 hours.",
        });
      } else if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors as FieldErrors);
      } else {
        toast.error('Failed to send message', {
          description: result.error || 'Please try again later.',
        });
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
        <div className="bg-primary/10 rounded-full p-4">
          <CheckCircle className="text-primary h-12 w-12" />
        </div>
        <h3 className="text-xl font-semibold">Message Sent!</h3>
        <p className="text-muted-foreground max-w-sm">
          Thank you for contacting us. We&apos;ll get back to you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isPending}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Inquiry Type *</Label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          disabled={isPending}
          aria-invalid={!!fieldErrors.type}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="" disabled>
            Select inquiry type
          </option>
          {contactTypes.map((type) => (
            <option key={type} value={type}>
              {contactTypeLabels[type as ContactType]}
            </option>
          ))}
        </select>
        {fieldErrors.type && <p className="text-sm text-red-500">{fieldErrors.type[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Brief description of your inquiry"
          value={formData.subject}
          onChange={handleChange}
          disabled={isPending}
          aria-invalid={!!fieldErrors.subject}
        />
        {fieldErrors.subject && <p className="text-sm text-red-500">{fieldErrors.subject[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Please describe your inquiry in detail..."
          rows={6}
          value={formData.message}
          onChange={handleChange}
          disabled={isPending}
          aria-invalid={!!fieldErrors.message}
        />
        {fieldErrors.message && <p className="text-sm text-red-500">{fieldErrors.message[0]}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        We typically respond within 24 hours.
      </p>
    </form>
  );
}
