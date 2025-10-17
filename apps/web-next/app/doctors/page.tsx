'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import type { Doctor } from '@/lib/types';

const doctorImages = [
  'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.getDoctors();
        setDoctors(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">Loading doctors...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold">Doctors</h1>
      <p className="text-slate-600 mt-2">Meet our team of experienced dental professionals.</p>

      {doctors.length === 0 ? (
        <div className="mt-6 p-6 rounded-2xl bg-slate-50 text-center">
          <p className="text-slate-600">No doctors available at the moment.</p>
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => {
            const imageUrl = doctorImages[index % doctorImages.length];

            return (
              <div
                key={doctor.id}
                className="rounded-2xl overflow-hidden bg-white border shadow hover:shadow-lg transition-shadow"
              >
                <Image
                  src={imageUrl}
                  alt={doctor.name}
                  width={800}
                  height={600}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <div className="font-semibold">{doctor.name}</div>
                  {doctor.specialty && (
                    <div className="text-sm text-slate-600">{doctor.specialty}</div>
                  )}
                  {doctor.languages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {doctor.languages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700"
                        >
                          {lang === 'en' ? 'English' : lang === 'ar' ? 'Arabic' : lang}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    href="/appointments"
                    className="mt-3 inline-flex items-center rounded-xl bg-blue-600 text-white px-4 h-10 hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
