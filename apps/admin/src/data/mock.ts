export const dashboardSummaryMock = {
  appointmentsToday: 24,
  pendingConfirmations: 5,
  revenueMonthToDate: 186400,
  newPatients: 12
};

export const upcomingAppointmentsMock = [
  {
    id: "apt-2024-001",
    patientName: "Sara Al-Hassan",
    doctorName: "Dr. Layla Rahman",
    serviceName: "Invisalign consultation",
    scheduledAt: new Date().setHours(10, 15, 0, 0),
    status: "SCHEDULED"
  },
  {
    id: "apt-2024-002",
    patientName: "Mohammed Aziz",
    doctorName: "Dr. Omar Idris",
    serviceName: "Root canal therapy",
    scheduledAt: new Date().setHours(11, 0, 0, 0),
    status: "CONFIRMED"
  },
  {
    id: "apt-2024-003",
    patientName: "Noura Al-Farsi",
    doctorName: "Dr. Layla Rahman",
    serviceName: "Teeth whitening",
    scheduledAt: new Date().setHours(11, 45, 0, 0),
    status: "SCHEDULED"
  },
  {
    id: "apt-2024-004",
    patientName: "Hassan Suleiman",
    doctorName: "Dr. Omar Idris",
    serviceName: "Wisdom tooth extraction",
    scheduledAt: new Date().setHours(13, 30, 0, 0),
    status: "CONFIRMED"
  },
  {
    id: "apt-2024-005",
    patientName: "Lina Farah",
    doctorName: "Dr. Noor Haddad",
    serviceName: "Routine cleaning",
    scheduledAt: new Date().setHours(14, 10, 0, 0),
    status: "SCHEDULED"
  },
  {
    id: "apt-2024-006",
    patientName: "Omar Khaled",
    doctorName: "Dr. Noor Haddad",
    serviceName: "Filling replacement",
    scheduledAt: new Date().setHours(15, 0, 0, 0),
    status: "SCHEDULED"
  }
] as const;

export const settingsSecurityMock = {
  passwordHints: [
    { label: "At least 8 characters", satisfied: true },
    { label: "Includes a symbol", satisfied: true },
    { label: "Mix of upper & lower case", satisfied: false }
  ],
  toggles: [
    {
      label: "Login alerts",
      description: "Notify staff via email when a new device signs in.",
      enabled: true
    },
    {
      label: "Session timeout",
      description: "Automatically sign out users after 30 minutes of inactivity.",
      enabled: true
    },
    {
      label: "Download approvals",
      description: "Require admin approval before exporting patient records.",
      enabled: false
    }
  ],
  sessions: [
    {
      device: "MacBook Pro • Safari",
      location: "Dubai, UAE",
      lastActive: "Active now"
    },
    {
      device: "iPad Air • Clinic App",
      location: "Dubai, UAE",
      lastActive: "25 minutes ago"
    },
    {
      device: "Windows PC • Chrome",
      location: "Sharjah, UAE",
      lastActive: "Yesterday"
    }
  ]
};
