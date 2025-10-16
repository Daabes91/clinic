import { Card, CardContent, CardHeader, CardTitle } from "@clinic/ui-kit";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance dashboards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>
            Visualize conversion, revenue, and doctor productivity by date range, service,
            and marketing channel. Integrate with Chart.js or Recharts.
          </p>
          <p className="rounded-lg bg-slate-100 p-3 text-xs uppercase tracking-widest text-slate-500">
            Chart components will arrive once analytics endpoints are live.
          </p>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-dashed bg-white/60">
          <CardContent className="flex h-48 items-center justify-center text-sm text-slate-500">
            Revenue trends placeholder
          </CardContent>
        </Card>
        <Card className="border-dashed bg-white/60">
          <CardContent className="flex h-48 items-center justify-center text-sm text-slate-500">
            Doctor utilization placeholder
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
