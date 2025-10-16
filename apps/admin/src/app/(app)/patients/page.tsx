import { Card, CardContent, CardHeader, CardTitle, DataTablePlaceholder } from "@clinic/ui-kit";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient search</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Search, segment, and export patient profiles. Integrate with analytics tools to
          build retention campaigns.
        </CardContent>
      </Card>
      <DataTablePlaceholder
        title="Patient directory"
        description="Connect to /api/admin/patients with pagination, filters, and badge indicators for treatment plans."
      />
    </div>
  );
}
