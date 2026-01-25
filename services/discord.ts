import { ContactFormData, contactTypeLabels } from '@/lib/validations/contact';

interface DiscordEmbed {
  title: string;
  color: number;
  fields: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp: string;
  footer: {
    text: string;
  };
}

interface DiscordWebhookPayload {
  embeds: DiscordEmbed[];
}

const TYPE_COLORS: Record<string, number> = {
  general: 0x3498db, // Blue
  support: 0xe74c3c, // Red
  billing: 0x2ecc71, // Green
  feature: 0x9b59b6, // Purple
  other: 0x95a5a6, // Gray
};

export async function sendContactToDiscord(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('DISCORD_WEBHOOK_URL is not configured');
    return { success: false, error: 'Discord webhook is not configured' };
  }

  const embed: DiscordEmbed = {
    title: 'New Contact Form Submission',
    color: TYPE_COLORS[data.type] || TYPE_COLORS.other,
    fields: [
      {
        name: 'Email',
        value: data.email,
        inline: true,
      },
      {
        name: 'Type',
        value: contactTypeLabels[data.type],
        inline: true,
      },
      {
        name: 'Subject',
        value: data.subject,
      },
      {
        name: 'Message',
        value: data.message.length > 1024 ? `${data.message.slice(0, 1021)}...` : data.message,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'TagStock Contact Form',
    },
  };

  const payload: DiscordWebhookPayload = {
    embeds: [embed],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord webhook error:', errorText);
      return { success: false, error: 'Failed to send message to Discord' };
    }

    return { success: true };
  } catch (error) {
    console.error('Discord webhook error:', error);
    return { success: false, error: 'Failed to connect to Discord' };
  }
}
