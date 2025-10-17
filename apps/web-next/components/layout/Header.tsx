'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-semibold text-slate-900">Airi Clinic</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link
            href="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/services"
            className={`nav-link ${isActive('/services') ? 'active' : ''}`}
          >
            Services
          </Link>
          <Link
            href="/doctors"
            className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}
          >
            Doctors
          </Link>
          <Link
            href="/appointments"
            className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
          >
            Appointments
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                My Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-full border px-3 h-9 hover:bg-slate-50 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`nav-link text-slate-500 ${isActive('/login') ? 'active' : ''}`}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border hover:bg-slate-50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 grid gap-2">
            <Link href="/" className="nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/services" className="nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/doctors" className="nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              Doctors
            </Link>
            <Link href="/appointments" className="nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              Appointments
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full border px-3 h-9 w-max hover:bg-slate-50 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link text-slate-500 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center rounded-full bg-blue-600 px-4 text-white w-max hover:bg-blue-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
