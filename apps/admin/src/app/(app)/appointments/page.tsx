import { Card, CardContent, CardHeader, CardTitle, DataTablePlaceholder } from "@clinic/ui-kit";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Filter by doctor, service, or status to narrow the calendar or list view.</p>
            <p className="rounded-lg bg-slate-100 p-3 text-xs uppercase tracking-widest text-slate-500">
              Doctor toggle coming in Phase 5
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendar preview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">
            Integrate a full calendar component (day/week/month) once availability endpoints are ready.
          </CardContent>
        </Card>
      </section>
      <DataTablePlaceholder
        title="Appointments list"
        description="Interactive table with quick actions will load bookings from /api/admin/appointments."
      />
    </div>
  );
}
