export function CreditPolicy() {
  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <h3 className="mb-4 text-lg font-bold">Credit Consumption Policy</h3>
      <div className="grid gap-6 text-sm md:grid-cols-2">
        <div>
          <h4 className="text-primary mb-2 font-semibold">Monthly Refresh</h4>
          <p className="text-muted-foreground">
            Subscription credits refresh every month. Unused subscription credits reset at the end
            of the cycle (except for explicit rollover plans).
          </p>
        </div>
        <div>
          <h4 className="text-primary mb-2 font-semibold">Priority Handling</h4>
          <p className="text-muted-foreground">
            We always use your <strong>Subscription Credits</strong> first. Additional{' '}
            <strong>Purchased Credits</strong> are only consumed after your monthly quota is fully
            used.
          </p>
        </div>
      </div>
    </div>
  );
}
