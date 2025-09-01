import { User, Organization, Appointment, DoctorSchedule, Room, PatientQueue, Media, Notification } from '@/types'

// Mock database for development
class MockDatabase {
  private users: User[] = []
  private organizations: Organization[] = []
  private appointments: Appointment[] = []
  private schedules: DoctorSchedule[] = []
  private rooms: Room[] = []
  private queues: PatientQueue[] = []
  private media: Media[] = []
  private notifications: Notification[] = []

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Seed organizations
    this.organizations = [
      {
        id: 'org-1',
        name: 'Medika General Hospital',
        type: 'hospital',
        address: '123 Medical Center Dr, Healthcare City',
        phone: '+1-555-0123',
        email: 'info@medikahospital.com',
        website: 'https://medikahospital.com',
        businessHours: [
          { day: 1, open: '08:00', close: '18:00', isOpen: true },
          { day: 2, open: '08:00', close: '18:00', isOpen: true },
          { day: 3, open: '08:00', close: '18:00', isOpen: true },
          { day: 4, open: '08:00', close: '18:00', isOpen: true },
          { day: 5, open: '08:00', close: '18:00', isOpen: true },
          { day: 6, open: '09:00', close: '14:00', isOpen: true },
          { day: 0, open: '09:00', close: '14:00', isOpen: false },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]

    // Seed users
    this.users = [
      {
        id: 'user-1',
        email: 'admin@medika.com',
        name: 'Dr. Sarah Johnson',
        role: 'admin',
        organizationId: 'org-1',
        phone: '+1-555-0001',
        avatar: '/avatars/admin.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        email: 'doctor.smith@medika.com',
        name: 'Dr. Michael Smith',
        role: 'doctor',
        organizationId: 'org-1',
        phone: '+1-555-0002',
        avatar: '/avatars/doctor.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-3',
        email: 'nurse.wilson@medika.com',
        name: 'Nurse Emily Wilson',
        role: 'nurse',
        organizationId: 'org-1',
        phone: '+1-555-0003',
        avatar: '/avatars/nurse.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-4',
        email: 'patient.john@email.com',
        name: 'John Doe',
        role: 'patient',
        organizationId: 'org-1',
        phone: '+1-555-0004',
        avatar: '/avatars/patient.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]

    // Seed rooms
    this.rooms = [
      {
        id: 'room-1',
        organizationId: 'org-1',
        name: 'Consultation Room 1',
        type: 'consultation',
        capacity: 4,
        isAvailable: true,
        equipment: ['Examination table', 'Blood pressure monitor', 'Stethoscope'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'room-2',
        organizationId: 'org-1',
        name: 'Consultation Room 2',
        type: 'consultation',
        capacity: 4,
        isAvailable: true,
        equipment: ['Examination table', 'Blood pressure monitor', 'Stethoscope'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'room-3',
        organizationId: 'org-1',
        name: 'Waiting Area',
        type: 'waiting',
        capacity: 20,
        isAvailable: true,
        equipment: ['Chairs', 'TV', 'Magazines'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]

    // Seed schedules
    this.schedules = [
      {
        id: 'schedule-1',
        doctorId: 'user-2',
        organizationId: 'org-1',
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        maxAppointments: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'schedule-2',
        doctorId: 'user-2',
        organizationId: 'org-1',
        dayOfWeek: 2, // Tuesday
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        maxAppointments: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }

  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(user)
    return user
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(user => user.id === id)
    if (index === -1) return null
    
    this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date() }
    return this.users[index]
  }

  // Organization operations
  async findOrganizationById(id: string): Promise<Organization | null> {
    return this.organizations.find(org => org.id === id) || null
  }

  async findOrganizations(): Promise<Organization[]> {
    return this.organizations
  }

  // Appointment operations
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const appointment: Appointment = {
      ...appointmentData,
      id: `appointment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.appointments.push(appointment)
    return appointment
  }

  async findAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointments.filter(apt => apt.patientId === patientId)
  }

  async findAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointments.filter(apt => apt.doctorId === doctorId)
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    const index = this.appointments.findIndex(apt => apt.id === id)
    if (index === -1) return null
    
    this.appointments[index] = { ...this.appointments[index], ...updates, updatedAt: new Date() }
    return this.appointments[index]
  }

  // Schedule operations
  async findDoctorSchedule(doctorId: string, dayOfWeek: number): Promise<DoctorSchedule | null> {
    return this.schedules.find(schedule => 
      schedule.doctorId === doctorId && schedule.dayOfWeek === dayOfWeek
    ) || null
  }

  // Queue operations
  async createQueueEntry(queueData: Omit<PatientQueue, 'id' | 'createdAt' | 'updatedAt'>): Promise<PatientQueue> {
    const queueEntry: PatientQueue = {
      ...queueData,
      id: `queue-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.queues.push(queueEntry)
    return queueEntry
  }

  async findQueueByOrganization(organizationId: string): Promise<PatientQueue[]> {
    return this.queues.filter(queue => queue.organizationId === organizationId)
  }

  async updateQueuePosition(id: string, position: number): Promise<PatientQueue | null> {
    const index = this.queues.findIndex(queue => queue.id === id)
    if (index === -1) return null
    
    this.queues[index] = { ...this.queues[index], position, updatedAt: new Date() }
    return this.queues[index]
  }

  // Media operations
  async createMedia(mediaData: Omit<Media, 'id' | 'createdAt' | 'updatedAt'>): Promise<Media> {
    const media: Media = {
      ...mediaData,
      id: `media-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.media.push(media)
    return media
  }

  async findMediaByUser(userId: string): Promise<Media[]> {
    return this.media.filter(m => m.uploadedBy === userId)
  }

  // Notification operations
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}`,
      createdAt: new Date(),
    }
    this.notifications.push(notification)
    return notification
  }

  async findNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => n.userId === userId)
  }

  async markNotificationAsRead(id: string): Promise<Notification | null> {
    const index = this.notifications.findIndex(n => n.id === id)
    if (index === -1) return null
    
    this.notifications[index] = { ...this.notifications[index], isRead: true }
    return this.notifications[index]
  }
}

// Export singleton instance
export const db = new MockDatabase()
