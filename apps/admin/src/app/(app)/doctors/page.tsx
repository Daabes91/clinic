import { Card, CardContent, CardHeader, CardTitle, DataTablePlaceholder } from "@clinic/ui-kit";

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Doctor profiles</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Manage provider availability, specialties, and WhatsApp notification preferences.
        </CardContent>
      </Card>
      <DataTablePlaceholder
        title="Doctors list"
        description="CRUD interfaces with localized bios will sync against /api/admin/doctors."
      />
    </div>
  );
}
