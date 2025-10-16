import { Card, CardContent, CardHeader, CardTitle } from "@clinic/ui-kit";
import {
  Bell,
  FileText,
  LaptopMinimal,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  SmartphoneNfc,
  UserRound
} from "lucide-react";
import { settingsSecurityMock } from "@/data/mock";

const tabs = [
  { label: "Profile", icon: UserRound },
  { label: "Security", icon: ShieldCheck, active: true },
  { label: "Notifications", icon: Bell },
  { label: "Preferences", icon: SlidersHorizontal },
  { label: "Documents", icon: FileText }
];

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <header className="rounded-4xl bg-gradient-to-br from-slate-900 via-emerald-900 to-emerald-700 px-10 py-12 text-white shadow-2xl">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">Settings</h1>
              <p className="text-sm text-white/70">
                Manage your account controls, notifications, and security settings.
              </p>
            </div>
            <nav className="flex flex-wrap gap-3">
              {tabs.map(({ label, icon: Icon, active }) => (
                <button
                  key={label}
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-white text-emerald-700 shadow shadow-emerald-500/30"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-4 text-sm shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-white/60">Security center</p>
            <p className="mt-2 text-xl font-semibold">No unresolved alerts</p>
            <p className="text-xs text-white/70">
              Last password rotation completed 12 days ago.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-card">
          <CardHeader className="flex flex-col gap-1 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Password</CardTitle>
              <p className="text-xs text-slate-500">
                Update your password to keep your account secure.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow shadow-emerald-500/30 hover:bg-emerald-500">
                Save changes
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-2">
              <InputField label="Current password" placeholder="Enter current password" />
              <InputField label="New password" placeholder="••••••••" />
              <InputField label="Re-enter password" placeholder="••••••••" />
              <PasswordChecklist />
            </div>
            <p className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
              Tip: Use a mix of uppercase letters, numbers, and special characters. Passwords expire every 90 days by clinic policy.
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              2-factor authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-slate-500">
              Require an additional verification code when staff members sign in from new locations.
            </p>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-content-center rounded-full bg-emerald-50 text-emerald-600">
                  <SmartphoneNfc className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Google Authenticator</p>
                  <p className="text-xs text-slate-500">
                    Scan a QR code or enter a setup key to activate.
                  </p>
                </div>
              </div>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100">
                Configure
              </button>
            </div>
            <div className="space-y-3">
              {settingsSecurityMock.toggles.map((toggle) => (
                <ToggleRow key={toggle.label} {...toggle} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-none shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Active sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {settingsSecurityMock.sessions.map((session) => (
              <div
                key={session.device}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-content-center rounded-full bg-slate-100 text-slate-500">
                    <LaptopMinimal className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{session.device}</p>
                    <p className="text-xs text-slate-500">{session.location}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-medium text-slate-900">{session.lastActive}</p>
                  <button className="text-emerald-600 hover:text-emerald-500">
                    Sign out
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Login alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-500">
            <p>
              Control how staff are notified when security events occur (new device sign-in,
              password change, or unsuccessful login attempts).
            </p>
            <ul className="space-y-2 text-xs">
              <li className="rounded-xl bg-slate-50 px-3 py-2">
                ✔️ Email alerts enabled for all roles
              </li>
              <li className="rounded-xl bg-slate-50 px-3 py-2">
                ✔️ WhatsApp alerts enabled for admins
              </li>
              <li className="rounded-xl bg-slate-50 px-3 py-2">
                ⚠️ SMS fallback disabled
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function InputField({
  label,
  placeholder
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200">
        <Lock className="h-4 w-4 text-slate-400" />
        <input
          type="password"
          placeholder={placeholder}
          className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-300"
        />
      </div>
    </label>
  );
}

function PasswordChecklist() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
      <p className="font-medium text-slate-600">Password requirements</p>
      <ul className="mt-2 space-y-1.5">
        {settingsSecurityMock.passwordHints.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span className={item.satisfied ? "text-emerald-500" : "text-slate-300"}>●</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled
}: {
  label: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <span
        className={`inline-flex h-6 w-11 items-center rounded-full border transition ${
          enabled
            ? "border-emerald-500 bg-emerald-500"
            : "border-slate-300 bg-slate-200"
        }`}
      >
        <span
          className={`ml-1 inline-block h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </span>
    </div>
  );
}
