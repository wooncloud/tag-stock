import { z } from 'zod';

export const contactTypes = [
  'general',
  'support',
  'billing',
  'feature',
  'other',
] as const;

export type ContactType = (typeof contactTypes)[number];

export const contactTypeLabels: Record<ContactType, string> = {
  general: 'General Inquiry',
  support: 'Technical Support',
  billing: 'Billing & Subscription',
  feature: 'Feature Request',
  other: 'Other',
};

export const contactSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  type: z.enum(contactTypes, {
    message: 'Please select an inquiry type',
  }),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
