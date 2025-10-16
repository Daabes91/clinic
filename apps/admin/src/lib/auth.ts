import { Buffer } from "node:buffer";
import { cookies } from "next/headers";

export type StaffRole = "ADMIN" | "RECEPTIONIST" | "DOCTOR";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
};

const FALLBACK_ROLE: StaffRole = "ADMIN";

function parseSessionCookie(value: string): StaffUser | null {
  if (!value) {
    return null;
  }

  try {
    const decoded = Buffer.from(value, "base64").toString("utf-8");
    const payload = JSON.parse(decoded) as Partial<StaffUser>;
    if (
      payload &&
      typeof payload.id === "string" &&
      typeof payload.name === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "ADMIN" ||
        payload.role === "RECEPTIONIST" ||
        payload.role === "DOCTOR")
    ) {
      return payload as StaffUser;
    }
  } catch {
    return null;
  }

  return null;
}

export async function getCurrentStaff(): Promise<StaffUser | null> {
  const sessionCookie = cookies().get("staff_session")?.value;
  const parsed = sessionCookie ? parseSessionCookie(sessionCookie) : null;

  if (parsed) {
    return parsed;
  }

  if (process.env.NODE_ENV === "development") {
    const mockRole = (process.env.ADMIN_MOCK_ROLE as StaffRole) ?? FALLBACK_ROLE;
    return {
      id: "mock-staff",
      name: "Mock Staff",
      email: "mock@clinic.com",
      role: mockRole
    };
  }

  return null;
}

export function hasRequiredRole(
  staff: StaffUser | null,
  allowed: StaffRole[]
): boolean {
  if (!staff) {
    return false;
  }
  return allowed.includes(staff.role);
}
