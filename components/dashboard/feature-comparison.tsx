import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FEATURES = [
  { name: 'Price', free: '$0', pro: '$5/mo', max: '$19/mo' },
  { name: 'Credits per month', free: '10', pro: '500', max: '2,000' },
  {
    name: 'AI keyword generation',
    free: 'Basic (~20)',
    pro: 'Advanced (~50)',
    max: 'Advanced (~50)',
  },
  { name: 'IPTC/XMP metadata embedding', free: '✓', pro: '✓', max: '✓' },
  { name: 'Batch processing', free: '-', pro: '✓', max: '✓' },
  { name: 'Multi-upload', free: '-', pro: '✓', max: '✓' },
  { name: 'Credit rollover', free: '-', pro: '-', max: 'Up to 1,000' },
  { name: 'Priority support', free: '-', pro: '-', max: '✓' },
];

export function FeatureComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Comparison</CardTitle>
        <CardDescription>See what&apos;s included in each plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Feature</th>
                <th className="px-4 py-3 text-center">Free</th>
                <th className="bg-primary/5 px-4 py-3 text-center font-bold">Pro</th>
                <th className="text-muted-foreground px-4 py-3 text-center">Max</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature) => (
                <tr key={feature.name} className="border-b">
                  <td className="px-4 py-3">{feature.name}</td>
                  <td className="px-4 py-3 text-center">{feature.free}</td>
                  <td className="bg-primary/5 px-4 py-3 text-center font-medium">{feature.pro}</td>
                  <td className="text-muted-foreground px-4 py-3 text-center">{feature.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
