import { Card, CardContent, CardHeader, CardTitle, DataTablePlaceholder } from "@clinic/ui-kit";

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Treatment plans</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Track plan stages, payment schedules, and clinician notes. Future work will
          integrate secure file uploads for x-rays and consent forms.
        </CardContent>
      </Card>
      <DataTablePlaceholder
        title="Plans & payments"
        description="Pull from /api/admin/plans with drill-down modals for invoices and payment history."
      />
    </div>
  );
}
