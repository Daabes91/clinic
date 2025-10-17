'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Service } from '@/lib/types';

const serviceEmojis: Record<string, string> = {
  cleaning: '🦷',
  whitening: '✨',
  orthodontics: '🪥',
  filling: '🦷',
  implants: '🦴',
  extraction: '🦷',
  'root-canal': '🦷',
  checkup: '🔍',
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">Loading services...</p>
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
      <h1 className="text-3xl font-bold">Services</h1>
      <p className="text-slate-600 mt-2">
        Comprehensive dental care services for you and your family.
      </p>

      {services.length === 0 ? (
        <div className="mt-6 p-6 rounded-2xl bg-slate-50 text-center">
          <p className="text-slate-600">No services available at the moment.</p>
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const emoji = serviceEmojis[service.slug] || '🦷';

            return (
              <div
                key={service.slug}
                className="p-6 rounded-2xl bg-white shadow border hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl">{emoji}</div>
                <h3 className="font-semibold mt-2">{service.name}</h3>
                {service.summary && (
                  <p className="text-sm text-slate-600 mt-1">{service.summary}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
