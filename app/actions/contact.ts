'use server';

import { contactSchema } from '@/lib/validations/contact';
import { sendContactToDiscord } from '@/services/discord';

export interface ContactActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitContact(formData: FormData): Promise<ContactActionResult> {
  const rawData = {
    email: formData.get('email'),
    type: formData.get('type'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const validationResult = contactSchema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of validationResult.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    }
    return { success: false, fieldErrors };
  }

  const result = await sendContactToDiscord(validationResult.data);

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to send message' };
  }

  return { success: true };
}
