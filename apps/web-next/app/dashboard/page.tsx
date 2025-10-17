'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

// Since the backend doesn't have a patient appointments endpoint yet,
// we'll create a simple placeholder dashboard
export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      <p className="text-slate-600 mt-2">Welcome back, {user.name}!</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Link
          href="/appointments"
          className="p-6 rounded-2xl bg-white border shadow hover:shadow-lg transition-shadow group"
        >
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
            Book Appointment
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Schedule your next dental visit
          </p>
        </Link>

        <Link
          href="/services"
          className="p-6 rounded-2xl bg-white border shadow hover:shadow-lg transition-shadow group"
        >
          <div className="text-3xl mb-2">🦷</div>
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
            Our Services
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Explore our dental care services
          </p>
        </Link>

        <Link
          href="/doctors"
          className="p-6 rounded-2xl bg-white border shadow hover:shadow-lg transition-shadow group"
        >
          <div className="text-3xl mb-2">👨‍⚕️</div>
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
            Meet Our Doctors
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            View our team of specialists
          </p>
        </Link>
      </div>

      {/* Appointments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Your Appointments</h2>
        <p className="text-slate-600 mt-1">
          Upcoming and past appointments will appear here.
        </p>

        <div className="mt-4 p-6 rounded-2xl border bg-slate-50 text-center">
          <p className="text-slate-600">
            No appointments yet.{' '}
            <Link href="/appointments" className="text-blue-700 font-semibold hover:underline">
              Book your first appointment →
            </Link>
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <div className="mt-4 p-6 rounded-2xl bg-white border shadow">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-semibold text-slate-500">Name</span>
              <p className="text-slate-900">{user.name}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-500">Email</span>
              <p className="text-slate-900">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
