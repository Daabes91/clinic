'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Doctor, Service, AvailabilitySlot } from '@/lib/types';

export default function AppointmentsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [bookingMode, setBookingMode] = useState<'CLINIC_VISIT' | 'VIRTUAL_CONSULTATION'>('CLINIC_VISIT');
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, doctorsData] = await Promise.all([
          api.getServices(),
          api.getDoctors(),
        ]);
        setServices(servicesData);
        setDoctors(doctorsData);

        if (servicesData.length > 0) setSelectedServiceSlug(servicesData[0].slug);
        if (doctorsData.length > 0) setSelectedDoctorId(doctorsData[0].id.toString());
      } catch (err: any) {
        setError(err.message || 'Failed to load booking options');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && selectedServiceSlug && selectedDate) {
      fetchAvailabilitySlots();
    }
  }, [selectedDoctorId, selectedServiceSlug, selectedDate]);

  const fetchAvailabilitySlots = async () => {
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);

    try {
      const data = await api.getAvailabilitySlots(
        parseInt(selectedDoctorId),
        selectedServiceSlug,
        selectedDate
      );
      setSlots(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load availability slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setLoading(true);

    try {
      await api.createBooking({
        patientId: user.id,
        doctorId: parseInt(selectedDoctorId),
        serviceSlug: selectedServiceSlug,
        scheduledAt: selectedSlot.start,
        bookingMode,
      });

      setSuccess('Appointment booked successfully!');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const formatSlotTime = (slot: AvailabilitySlot) => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
  };

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold">Book an Appointment</h1>
      <p className="text-slate-600 mt-2">Choose service, doctor, date and time slot.</p>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Visit Mode</label>
            <select
              value={bookingMode}
              onChange={(e) => setBookingMode(e.target.value as any)}
              className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CLINIC_VISIT">In-person</option>
              <option value="VIRTUAL_CONSULTATION">Virtual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Service</label>
            <select
              value={selectedServiceSlug}
              onChange={(e) => setSelectedServiceSlug(e.target.value)}
              className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {services.map((service) => (
                <option key={service.id} value={service.slug}>
                  {service.nameEn || service.nameAr || service.slug}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedSlot}
            className="w-full rounded-xl bg-blue-600 text-white h-12 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-semibold mb-3">Available Slots</h2>

          {!selectedDate ? (
            <p className="text-sm text-slate-600">Please select a date to see available time slots.</p>
          ) : slotsLoading ? (
            <div className="flex items-center gap-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-sm text-slate-600">Loading available slots...</p>
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-slate-600">No slots available for the selected date.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {slots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 border shadow transition-colors ${
                    selectedSlot === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white hover:border-blue-600 hover:text-blue-700'
                  }`}
                >
                  ⏰ {formatSlotTime(slot)}
                </button>
              ))}
            </div>
          )}

          {selectedSlot && (
            <p className="mt-3 text-sm text-slate-600">
              Selected slot: {formatSlotTime(selectedSlot)}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
