import "server-only";
import {
  dashboardSummaryMock,
  upcomingAppointmentsMock
} from "@/data/mock";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!API_BASE) {
    throw new Error("Admin API base URL not configured");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
    next: { revalidate: 10 }
  });

  if (!response.ok) {
    throw new Error(`Admin API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export type DashboardSummary = {
  appointmentsToday: number;
  pendingConfirmations: number;
  revenueMonthToDate: number;
  newPatients: number;
};

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  if (!API_BASE) {
    return dashboardSummaryMock;
  }

  return request<DashboardSummary>("/dashboard/summary");
}

export type AppointmentListItem = {
  id: string;
  patientName: string;
  doctorName: string;
  serviceName: string;
  scheduledAt: string;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED";
};

export async function fetchUpcomingAppointments(): Promise<AppointmentListItem[]> {
  if (!API_BASE) {
    return upcomingAppointmentsMock.map((appointment) => ({
      ...appointment,
      scheduledAt: new Date(appointment.scheduledAt).toISOString()
    }));
  }

  return request<AppointmentListItem[]>("/appointments?filter=upcoming");
}
