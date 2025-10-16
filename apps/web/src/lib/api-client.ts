import "server-only";

import type { Locale } from "@/i18n/config";

export type ClinicService = {
  slug: string;
  name: string;
  summary: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  languages: string[];
};

type ServiceDetailResponse = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  doctorIds: string[];
};

export type AvailabilityRequest = {
  serviceSlug: string;
  doctorId?: string;
  date: string;
};

export type AvailabilitySlot = {
  doctorId: string;
  start: string;
  end: string;
};

export type BookingPayload = {
  serviceSlug: string;
  doctorId: string;
  slot: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const fallbackServices: Record<Locale, ClinicService[]> = {
  en: [
    {
      slug: "comprehensive-checkup",
      name: "Comprehensive Checkup",
      summary:
        "Full oral health assessment, x-rays, and personalized prevention plan."
    },
    {
      slug: "teeth-whitening",
      name: "Advanced Teeth Whitening",
      summary: "In-clinic whitening system delivering brighter smiles in one visit."
    },
    {
      slug: "invisible-aligners",
      name: "Invisible Aligners",
      summary: "Discrete orthodontic treatment designed around your lifestyle."
    }
  ],
  ar: [
    {
      slug: "comprehensive-checkup",
      name: "فحص شامل",
      summary: "تقييم كامل لصحة الفم مع مخطط وقائي مخصص."
    },
    {
      slug: "teeth-whitening",
      name: "تبييض الأسنان المتقدم",
      summary: "نتائج فورية مع أحدث تقنيات التبييض داخل العيادة."
    },
    {
      slug: "invisible-aligners",
      name: "تقويم شفاف",
      summary: "حلول تقويمية غير مرئية تناسب نمط حياتك."
    }
  ]
};

const fallbackDoctors: Doctor[] = [
  {
    id: "dr-asma",
    name: "Dr. Asma Al-Hassan",
    specialty: "Cosmetic Dentistry",
    languages: ["en", "ar"]
  },
  {
    id: "dr-samir",
    name: "Dr. Samir Haddad",
    specialty: "Oral Surgery",
    languages: ["en"]
  }
];

const fallbackSlots: AvailabilitySlot[] = [
  {
    doctorId: "dr-asma",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  },
  {
    doctorId: "dr-samir",
    start: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 90 * 60 * 1000).toISOString()
  }
];

async function request<T>(
  path: string,
  init?: RequestInit,
  locale?: Locale
): Promise<T> {
  if (!API_BASE) {
    throw new Error("API base URL not configured");
  }

  const url = new URL(path, API_BASE);
  if (locale) {
    url.searchParams.set("locale", locale);
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale ?? "en",
      ...init?.headers
    },
    credentials: "include",
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchServices(locale: Locale): Promise<ClinicService[]> {
  if (!API_BASE) {
    return fallbackServices[locale];
  }

  return request<ClinicService[]>("/services", undefined, locale);
}

export async function fetchServiceBySlug(
  locale: Locale,
  slug: string
): Promise<ClinicService> {
  if (!API_BASE) {
    const match = fallbackServices[locale].find((service) => service.slug === slug);
    if (!match) {
      throw new Error("Service not found");
    }
    return match;
  }

  const detail = await request<ServiceDetailResponse>(`/services/${slug}`, undefined, locale);
  return {
    slug: detail.slug,
    name: detail.name,
    summary: detail.summary
  } satisfies ClinicService;
}

export async function fetchDoctorsByService(
  locale: Locale,
  serviceSlug?: string
): Promise<Doctor[]> {
  if (!API_BASE) {
    return fallbackDoctors;
  }

  const path = serviceSlug ? `/doctors?service=${serviceSlug}` : "/doctors";
  const response = await request<Array<{ id: number; name: string; specialty: string; languages: string[] }>>(
    path,
    undefined,
    locale
  );
  return response.map((doctor) => ({
    id: String(doctor.id),
    name: doctor.name,
    specialty: doctor.specialty,
    languages: doctor.languages
  }));
}

export async function fetchAvailability(
  locale: Locale,
  payload: AvailabilityRequest
): Promise<AvailabilitySlot[]> {
  if (!API_BASE) {
    return fallbackSlots;
  }

  const response = await request<Array<{ doctorId: number; doctorName: string; start: string; end: string }>>(
    "/availability",
    {
      method: "POST",
      body: JSON.stringify(payload)
    },
    locale
  );
  return response.map((slot) => ({
    doctorId: String(slot.doctorId),
    start: slot.start,
    end: slot.end
  }));
}

export async function createBooking(
  locale: Locale,
  payload: BookingPayload
): Promise<{ bookingId: string }> {
  if (!API_BASE) {
    return { bookingId: `mock-${Date.now()}` };
  }

  return request<{ bookingId: string }>(
    "/bookings",
    {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        doctorId: payload.doctorId ? Number(payload.doctorId) : undefined
      })
    },
    locale
  );
}
