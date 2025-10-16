export type DoctorServiceReference = {
  id: number;
  slug: string;
  nameEn: string | null;
};

export type DoctorAvailability = {
  id: number;
  type: "WEEKLY" | "ONE_TIME" | string;
  dayOfWeek: string | null;
  date: string | null;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export type DoctorAdmin = {
  id: number;
  fullName: string;
  specialty: string | null;
  bio: string | null;
  locales: string[];
  services: DoctorServiceReference[];
  createdAt: string;
};
