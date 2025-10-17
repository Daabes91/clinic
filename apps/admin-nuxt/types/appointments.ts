export type AppointmentAdmin = {
  id: number;
  patientName: string;
  doctorName: string;
  serviceName: string;
  scheduledAt: string;
  status: string;
  bookingMode: string;
};

export type AppointmentAdminDetail = {
  id: number;
  patient: { id: number; name: string } | null;
  doctor: { id: number; name: string } | null;
  service: { id: number; name: string } | null;
  status: string;
  bookingMode: string;
  scheduledAt: string | null;
  createdAt: string | null;
  notes: string | null;
};

export type AvailabilitySlot = {
  doctorId: number;
  doctorName: string;
  start: string;
  end: string;
};
