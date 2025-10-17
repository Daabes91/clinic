import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-6">
        <div>
          <div className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-semibold">Airi Clinic</span>
          </div>
          <p className="text-sm text-slate-600 mt-2">Trusted dental care. Easy online booking.</p>
        </div>
        <div>
          <h4 className="font-semibold">Links</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/appointments">
                Appointments
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/doctors">
                Doctors
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="text-sm text-slate-600 mt-2">
            +962 7 0000 0000
            <br />
            info@airiclinic.com
          </p>
        </div>
      </div>
    </footer>
  );
}
