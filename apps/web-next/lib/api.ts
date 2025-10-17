const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/public';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Only add Authorization header if we have a valid token
  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new APIError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    return fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Services
  getServices: async () => {
    return fetchAPI('/services');
  },

  // Doctors
  getDoctors: async () => {
    return fetchAPI('/doctors');
  },

  getDoctor: async (id: number) => {
    return fetchAPI(`/doctors/${id}`);
  },

  // Availability
  getAvailabilitySlots: async (
    doctorId: number,
    serviceSlug: string,
    date: string
  ) => {
    return fetchAPI('/availability', {
      method: 'POST',
      body: JSON.stringify({ doctorId, serviceSlug, date }),
    });
  },

  // Booking
  createBooking: async (data: {
    patientId: number;
    doctorId: number;
    serviceSlug: string;
    scheduledAt: string;
    bookingMode: 'CLINIC_VISIT' | 'VIRTUAL_CONSULTATION';
  }) => {
    return fetchAPI('/book', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export { APIError };
