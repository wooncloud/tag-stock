import { Metadata } from 'next';
import Link from 'next/link';

import { Mail, MessageSquare, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const metadata: Metadata = {
  title: 'Contact | TagStock',
  description: 'Please leave your inquiries about TagStock. We will respond as soon as possible.',
};

export default function ContactPage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Have any questions or need help?
            <br />
            Please feel free to contact us. We will respond quickly.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
              <CardDescription>
                Fill out the form below and we will get back to you soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="example@email.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter subject" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your inquiry in detail..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>You can contact us in several ways.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Mail className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Email</h3>
                    <p className="text-muted-foreground text-sm">support@tagstock</p>
                    <p className="text-muted-foreground text-sm">Weekdays 09:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Phone className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Phone</h3>
                    <p className="text-muted-foreground text-sm">02-1234-5678</p>
                    <p className="text-muted-foreground text-sm">
                      Weekdays 09:00 - 18:00 (Lunch 12:00 - 13:00)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>Check out our FAQ before contacting us.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold">Q. Is a free trial available?</h4>
                    <p className="text-muted-foreground text-sm">
                      Yes, free credits are provided upon signup to experience the service.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Q. What is the refund policy?</h4>
                    <p className="text-muted-foreground text-sm">
                      Unused credits can be fully refunded within 7 days of purchase.
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Q. Is there a bulk purchase discount?</h4>
                    <p className="text-muted-foreground text-sm">
                      We have separate discount plans for corporate customers. Please contact us via
                      email.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="ghost" className="cursor-pointer">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
