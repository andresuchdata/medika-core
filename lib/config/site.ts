export const siteConfig = {
  name: "Medika",
  description: "Medical Hospital Management System",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "https://medika.com/og.jpg",
  links: {
    twitter: "https://twitter.com/medika",
    github: "https://github.com/medika",
  },
  mobile: {
    // Future mobile subdomain configuration
    subdomain: process.env.NEXT_PUBLIC_MOBILE_SUBDOMAIN || "m",
    enabled: process.env.NEXT_PUBLIC_MOBILE_ENABLED === "true",
  },
  features: {
    // Feature flags for different phases
    appointments: true,
    queue: false,
    media: false,
    notifications: false,
    billing: false,
    laboratory: false,
  },
  responsive: {
    // Breakpoints for responsive design
    mobile: "640px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
  },
  navigation: {
    // Navigation items with mobile visibility
    items: [
      { name: "Dashboard", href: "/dashboard", icon: "Home", mobile: true },
      { name: "Patients", href: "/dashboard/patients", icon: "Users", mobile: true },
      { name: "Doctors", href: "/dashboard/doctors", icon: "Stethoscope", mobile: true },
      { name: "Appointments", href: "/dashboard/appointments", icon: "Calendar", mobile: true },
      { name: "Queue", href: "/dashboard/queue", icon: "Clock", mobile: true },
      { name: "Medical Records", href: "/dashboard/records", icon: "FileText", mobile: false },
      { name: "Organizations", href: "/dashboard/organizations", icon: "Building2", mobile: false },
      { name: "Notifications", href: "/dashboard/notifications", icon: "Bell", mobile: true },
      { name: "Settings", href: "/dashboard/settings", icon: "Settings", mobile: true },
    ],
  },
} as const

export type SiteConfig = typeof siteConfig
