import type { ReactNode } from "react";
import { CalendarCheck, MessageCircle, CreditCard, Clock } from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard
} from "@clinic/ui-kit";
import { fetchDashboardSummary, fetchUpcomingAppointments } from "@/lib/api-client";

export default async function DashboardPage() {
  const [summary, upcoming] = await Promise.all([
    fetchDashboardSummary(),
    fetchUpcomingAppointments()
  ]);

  const nextAppointments = upcoming.slice(0, 6);

  const onCallDoctors = [
    {
      name: "Dr. Asma Al-Hassan",
      specialty: "Cosmetic Dentistry",
      status: "In Clinic",
      nextSlot: "10:30 AM"
    },
    {
      name: "Dr. Samir Haddad",
      specialty: "Oral Surgery",
      status: "Post-Op Review",
      nextSlot: "11:15 AM"
    },
    {
      name: "Dr. Noor Rahman",
      specialty: "General Dentistry",
      status: "Consultation",
      nextSlot: "12:00 PM"
    }
  ];

  const statusTone: Record<string, string> = {
    SCHEDULED: "bg-slate-100 text-slate-700 border-slate-200",
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-100",
    CANCELLED: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Badge className="border-white/30 bg-white/10 text-xs tracking-widest uppercase">
              Today at a glance
            </Badge>
            <h1 className="text-3xl font-semibold lg:text-4xl">
              Smooth day ahead, reception!
            </h1>
            <p className="max-w-2xl text-sm text-white/80">
              Monitor confirmations, WhatsApp follow-ups, and doctor availability from a single view.
              Quick actions help you jump straight into the next task.
            </p>
            <div className="flex flex-wrap gap-3">
              <QuickAction
                icon={<CalendarCheck className="h-4 w-4" />}
                label="Create booking"
                description="Reserve a slot in seconds"
              />
              <QuickAction
                icon={<MessageCircle className="h-4 w-4" />}
                label="Send WhatsApp"
                description="Follow up with patients"
              />
              <QuickAction
                icon={<CreditCard className="h-4 w-4" />}
                label="Log payment"
                description="Update plan balances"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Appointments today"
              value={summary.appointmentsToday.toString()}
            />
            <StatCard
              label="New patients"
              value={summary.newPatients.toString()}
              trend="+5 in the last 7 days"
            />
            <StatCard
              label="Pending confirmations"
              value={summary.pendingConfirmations.toString()}
              trend="+2 since yesterday"
            />
            <StatCard
              label="Revenue (MTD)"
              value={`AED ${summary.revenueMonthToDate.toLocaleString()}`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming appointments</CardTitle>
              <p className="text-xs text-slate-500">
                Next six bookings · {summary.pendingConfirmations} awaiting confirmation
              </p>
            </div>
            <Badge variant="outline" className="border-slate-200 text-xs text-slate-600">
              {new Date().toLocaleDateString("en", {
                weekday: "short",
                month: "short",
                day: "numeric"
              })}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-full bg-blue-50 text-blue-600">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {appointment.patientName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {appointment.serviceName} · {appointment.doctorName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-slate-500">
                    <p className="font-semibold text-slate-900">
                      {new Date(appointment.scheduledAt).toLocaleTimeString("en", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                    <p>{new Date(appointment.scheduledAt).toLocaleDateString("en")}</p>
                  </div>
                  <Badge
                    className={`border ${statusTone[appointment.status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}
                  >
                    {appointment.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            ))}
            {nextAppointments.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-sm font-medium text-slate-600">
                  No bookings yet. Add a new appointment to populate the schedule.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>On-call doctors</CardTitle>
            <p className="text-xs text-slate-500">
              Who is available for quick consults and treatment plan approvals today.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {onCallDoctors.map((doctor) => (
              <div
                key={doctor.name}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doctor.name}</p>
                    <p className="text-xs text-slate-500">{doctor.specialty}</p>
                  </div>
                  <Badge variant="success">{doctor.status}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Next slot {doctor.nextSlot}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement pulse</CardTitle>
            <p className="text-xs text-slate-500">
              SMS and WhatsApp outreach performance based on the last 48 hours of activity.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <EngagementCard
              title="WhatsApp reminders"
              metric="92%"
              change="+6% vs last week"
              description="Patients opening reminders within 2 hours."
            />
            <EngagementCard
              title="Email confirmations"
              metric="81%"
              change="+3% vs last week"
              description="Delivered and acknowledged by patients."
            />
            <EngagementCard
              title="Payment follow-ups"
              metric="65%"
              change="+4% vs last week"
              description="Patients responding within 24 hours."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TargetProgress
              label="Confirmed bookings"
              value={summary.pendingConfirmations}
              target={summary.pendingConfirmations + 8}
            />
            <TargetProgress label="Outstanding invoices" value={3} target={5} />
            <TargetProgress label="Treatment plan updates" value={7} target={10} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function QuickAction({ icon, label, description }: { icon: ReactNode; label: string; description: string }) {
  return (
    <button className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-left text-sm transition hover:border-white/40 hover:bg-white/20">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
        {icon}
      </span>
      <span>
        <span className="block font-medium">{label}</span>
        <span className="block text-xs text-white/70">{description}</span>
      </span>
    </button>
  );
}

function EngagementCard({
  title,
  metric,
  change,
  description
}: {
  title: string;
  metric: string;
  change: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{metric}</p>
      <p className="text-xs font-medium text-emerald-600">{change}</p>
      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function TargetProgress({ label, value, target }: { label: string; value: number; target: number }) {
  const percentage = Math.min(100, Math.round((value / target) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>
          {value}/{target}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
