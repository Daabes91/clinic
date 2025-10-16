import { Card, CardContent, CardHeader, CardTitle, DataTablePlaceholder } from "@clinic/ui-kit";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-language services</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Configure English and Arabic titles, pricing visibility, and marketing copy. Hooks
          into public site to ensure consistent content.
        </CardContent>
      </Card>
      <DataTablePlaceholder
        title="Services catalog"
        description="Inline editing and publish status indicators will be powered by /api/admin/services."
      />
    </div>
  );
}
