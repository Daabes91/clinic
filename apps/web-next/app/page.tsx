import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-10 h-72 w-96 rounded-[63px] bg-[#F5F8FF]"></div>
        <div className="pointer-events-none absolute right-[-12rem] top-40 h-[54rem] w-[54rem] rotate-[-10deg] rounded-[123px] bg-[#F5F8FF]"></div>

        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm">
              Booking of doctor's appointment
            </span>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight text-blue-700">
              Don't Miss Our Exclusive Patient Special
            </h1>
            <p className="mt-6 max-w-xl text-blue-700/70 text-lg">
              Access quality dental care with quick online booking. Get your consultation and digital assessment.
            </p>

            <div className="mt-6 max-w-xl">
              <div className="relative rounded-full">
                <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow-xl">
                  <div className="pl-3 text-slate-400">✉️</div>
                  <input
                    placeholder="Enter your email"
                    className="flex-1 rounded-full px-2 py-2 text-slate-700 placeholder-slate-400 focus:outline-none"
                    type="email"
                  />
                  <Link
                    href="/signup"
                    className="h-12 shrink-0 rounded-full bg-blue-600 px-6 text-white font-semibold inline-flex items-center hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-2xl">
              <div>
                <div className="text-5xl font-extrabold tracking-tight text-slate-800">240</div>
                <div className="mt-2 text-sm text-slate-700">Qualified Specialists</div>
              </div>
              <div>
                <div className="text-5xl font-extrabold tracking-tight text-blue-700">1.456</div>
                <div className="mt-2 text-sm text-slate-700">Tests Done</div>
              </div>
              <div>
                <div className="text-5xl font-extrabold tracking-tight text-slate-800">1M+</div>
                <div className="mt-2 text-sm text-slate-700">Smiles</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1588771930290-24f3b0b1a888?q=80&w=1200&auto=format&fit=crop"
              alt="Dentist"
              width={1200}
              height={800}
              className="w-full max-w-xl rounded-3xl shadow-[50px_-56px_104px_rgba(28,91,235,0.05)] mx-auto"
              priority
            />
            <Image
              src="https://images.unsplash.com/photo-1588771930290-24f3b0b1a888?q=80&w=1200&auto=format&fit=crop"
              alt=""
              width={1200}
              height={800}
              className="pointer-events-none absolute left-8 top-0 w-full max-w-xl rounded-3xl opacity-30 blur-2xl -z-10"
              aria-hidden="true"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="glass border border-white/50 bg-white/80 text-blue-700 inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow">
                ⏰ 8:30am
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-700 text-white shadow">
                ⏰ 9:15am
              </button>
              <button className="glass border border-white/50 bg-white/80 text-blue-700 inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow">
                ⏰ 10:00am
              </button>
            </div>

            <div className="mt-6 space-y-4 max-w-md">
              <div className="glass bg-white/80 rounded-xl p-3 shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      className="h-16 w-16 rounded-xl object-cover"
                      src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=400&auto=format&fit=crop"
                      alt="Dr Angela"
                      width={400}
                      height={400}
                    />
                    <div>
                      <div className="font-semibold">Dr. Angela Taylor</div>
                      <div className="text-sm text-slate-600">Orthodontics</div>
                    </div>
                  </div>
                  <Link
                    href="/appointments"
                    className="rounded-lg bg-blue-700 px-4 py-2 text-white text-sm hover:bg-blue-800 transition-colors"
                  >
                    Select
                  </Link>
                </div>
              </div>
              <div className="glass bg-white/80 rounded-xl p-3 shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      className="h-16 w-16 rounded-xl object-cover"
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                      alt="Dr Dani"
                      width={400}
                      height={400}
                    />
                    <div>
                      <div className="font-semibold">Dr. Dani Daniels</div>
                      <div className="text-sm text-slate-600">Cosmetic</div>
                    </div>
                  </div>
                  <Link
                    href="/appointments"
                    className="rounded-lg bg-blue-700 px-4 py-2 text-white text-sm hover:bg-blue-800 transition-colors"
                  >
                    Select
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold">Our Services</h2>
          <p className="text-slate-600 mt-2">
            Teeth cleaning, fillings, implants, orthodontics, whitening, and more.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white shadow">
              <div className="text-3xl mb-2">🦷</div>
              <div className="font-semibold">Cleaning</div>
              <div className="text-sm text-slate-600">Routine hygiene & scaling</div>
            </div>
            <div className="p-5 rounded-2xl bg-white shadow">
              <div className="text-3xl mb-2">✨</div>
              <div className="font-semibold">Whitening</div>
              <div className="text-sm text-slate-600">In-clinic laser whitening</div>
            </div>
            <div className="p-5 rounded-2xl bg-white shadow">
              <div className="text-3xl mb-2">🪥</div>
              <div className="font-semibold">Orthodontics</div>
              <div className="text-sm text-slate-600">Braces & aligners</div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/services" className="inline-flex items-center text-blue-700 font-semibold hover:underline">
              View all services →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
