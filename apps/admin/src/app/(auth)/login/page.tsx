import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Clinic Admin</h1>
        <p className="text-sm text-slate-500">
          Sign in with your staff email to access appointments, reports, and settings.
        </p>
      </header>
      <form className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase text-slate-500">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="you@clinic.com"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase text-slate-500">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase text-slate-500">
            2FA code
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="123456"
          />
          <p className="text-xs text-slate-500">
            2FA enforcement is optional today; this input is a placeholder for Phase 5 work.
          </p>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Sign in
        </button>
      </form>
      <p className="text-center text-xs text-slate-500">
        Having trouble?{" "}
        <Link href="/support" className="font-medium text-blue-600 hover:text-blue-500">
          Contact operations
        </Link>
      </p>
    </div>
  );
}
