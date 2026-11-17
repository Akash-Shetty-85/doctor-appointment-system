// Core Enums and Types derived directly from BRD

export type Role = 'SUPER_ADMIN' | 'CLINIC_ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';

export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked-in'
  | 'In-consultation'
  | 'Completed'
  | 'Cancelled'
  | 'No-show'
  | 'Rescheduled';

export type AppointmentSource = 'online' | 'walk-in' | 'phone';
export type AppointmentMode = 'in-person' | 'teleconsult';
export type PaymentStatus = 'pending' | 'paid' | 'waived' | 'refunded'; // Reserved for Phase 2

export type EnquiryStatus = 'New' | 'Contacted' | 'Converted' | 'Closed';

export interface ClinicBranding {
  clinicName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  address: string;
  googleMapsEmbedUrl?: string;
  whatsappNumber: string;
  whatsappPrefilledMessage: string;
  languages: string[]; // e.g. ['English', 'Hindi', 'Kannada']
}

export interface ClinicSettings {
  workingHours: {
    open: string; // "09:00"
    close: string; // "20:00"
    daysOpen: number[]; // 0=Sun, 1=Mon... 6=Sat
  };
  holidays: string[]; // YYYY-MM-DD
  slotDurationMinutes: number; // default 15 or 30
  slotLockDurationSeconds: number; // default 300 (5 mins)
  bookingPolicy: 'auto-confirm' | 'receptionist-approval';
  cancellationCutoffHours: number; // e.g. 4 hours
  rescheduleCutoffHours: number;
  autoNoShowGraceMinutes: number; // e.g. 30 minutes
  notificationChannels: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
    inApp: boolean;
  };
}

export interface Branch {
  id: string;
  clinicId: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  isMain: boolean;
}

export interface Department {
  id: string;
  clinicId: string;
  name: string;
  description?: string;
}

export interface Clinic {
  id: string;
  subdomain: string;
  customDomain?: string;
  name: string;
  registrationNo: string;
  status: 'Pending' | 'Active' | 'Suspended';
  planId: string;
  branding: ClinicBranding;
  settings: ClinicSettings;
  branches: Branch[];
  departments: Department[];
  createdAt: string;
}

export interface UserMembership {
  clinicId: string;
  role: Role;
  branchId?: string;
}

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: 'Spouse' | 'Child' | 'Parent' | 'Other';
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  address?: string;
  allergies?: string[];
  medicalHistoryNotes?: string;
  memberships: UserMembership[];
  familyMembers?: FamilyMember[];
  consents?: {
    communication: boolean;
    dataProcessing: boolean;
    timestamp: string;
  };
}

export interface Doctor {
  id: string;
  clinicId: string;
  userId: string;
  name: string;
  title: string; // "Dr. Sarah Jenkins, MD"
  specialization: string; // e.g., "Cardiologist"
  qualifications: string; // e.g., "MBBS, MD (Cardiology)"
  experienceYears: number;
  bio: string;
  photoUrl: string;
  departmentId: string;
  branchIds: string[];
  serviceIds: string[];
  consultationFee: number;
  availableDays: number[]; // 0-6
  workingHours: {
    start: string; // "09:00"
    end: string; // "17:00"
  };
  breakTimes: {
    start: string; // "13:00"
    end: string; // "14:00"
  }[];
  leaves: string[]; // dates "YYYY-MM-DD"
  isAcceptingNewPatients: boolean;
}

export interface Service {
  id: string;
  clinicId: string;
  name: string;
  description: string;
  departmentId: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  preparationInstructions?: string;
}

export interface TimeSlot {
  time: string; // "09:30"
  available: boolean;
  isLocked?: boolean;
}

export interface SlotLock {
  doctorId: string;
  date: string;
  time: string;
  expiresAt: number; // timestamp
  sessionId: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "1-0-1 (After Food)"
  duration: string; // e.g. "5 Days"
  notes?: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  clinicalNotes: string;
  prescriptions: PrescriptionItem[];
  attachedReports?: {
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  followUpDate?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  tokenNumber?: number; // Daily queue token e.g., #04
  clinicId: string;
  branchId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  familyMemberId?: string; // If booked for family member
  forWhom: string; // "Self" or family member name
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  serviceId: string;
  serviceName: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "10:30"
  durationMinutes: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  mode: AppointmentMode;
  paymentStatus: PaymentStatus;
  patientNotes?: string;
  cancellationReason?: string;
  rescheduledFrom?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  preferredDepartment?: string;
  message: string;
  status: EnquiryStatus;
  assignedToStaffId?: string;
  assignedToStaffName?: string;
  notes?: string;
  convertedAppointmentId?: string;
  createdAt: string;
}

export interface CMSPage {
  id: string;
  clinicId: string;
  slug: 'home' | 'about' | 'contact' | 'faq' | 'gallery' | 'testimonials' | string;
  title: string;
  content: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  published: boolean;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  clinicId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorTitle: string;
  coverImage: string;
  publishedDate: string;
  category: string;
  readTime: string;
}

export interface FAQItem {
  id: string;
  clinicId: string;
  question: string;
  answer: string;
  category: string;
}

export interface Testimonial {
  id: string;
  clinicId: string;
  patientName: string;
  rating: number; // 1-5
  comment: string;
  treatmentName: string;
  date: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  limits: {
    maxDoctors: number;
    maxBranches: number;
    maxAppointmentsPerMonth: number;
  };
  featureFlags: {
    customDomain: boolean;
    whatsappIntegration: boolean;
    smsNotifications: boolean;
    teleconsultation: boolean;
    analyticsReports: boolean;
    multiLanguage: boolean;
  };
}
