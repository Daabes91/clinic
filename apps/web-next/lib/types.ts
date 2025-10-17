// Patient types
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  externalId: string;
  createdAt: string;
}

export interface PatientAuthResponse {
  token: string;
  patient: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PatientLoginRequest {
  email: string;
  password: string;
}

export interface PatientSignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

// Service types
export interface Service {
  slug: string;
  name: string;
  summary: string;
}

// Doctor types
export interface Doctor {
  id: number;
  name: string;
  specialty: string | null;
  languages: string[];
}

// Appointment/Booking types
export interface AvailabilitySlot {
  doctorId: number;
  doctorName: string;
  start: string; // ISO datetime
  end: string;   // ISO datetime
}

export interface BookingRequest {
  patientId: number;
  doctorId: number;
  serviceSlug: string;
  scheduledAt: string; // ISO datetime
  bookingMode: 'CLINIC_VISIT' | 'VIRTUAL_CONSULTATION';
}

export interface Appointment {
  id: number;
  patient: {
    id: number;
    name: string;
  };
  doctor: {
    id: number;
    name: string;
  };
  service: {
    id: number;
    name: string;
  };
  scheduledAt: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  bookingMode: 'CLINIC_VISIT' | 'VIRTUAL_CONSULTATION';
  createdAt: string;
}
