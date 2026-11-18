import { mockStore } from './mockStore';
import {
  Clinic,
  Doctor,
  Service,
  Appointment,
  Consultation,
  Enquiry,
  User,
  TimeSlot,
  AppointmentStatus,
  ClinicBranding,
  ClinicSettings,
} from '../types';

// Simulate async network delay (150ms - 300ms)
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Public Tenant
  resolveTenant: async (_hostOrSubdomain?: string): Promise<Clinic> => {
    await delay(100);
    return mockStore.getActiveClinic();
  },

  getAllClinics: async (): Promise<Clinic[]> => {
    await delay(150);
    return mockStore.getClinics();
  },

  // Auth & Session
  getMe: async (): Promise<{ user: User | null; role: string | null; clinic: Clinic }> => {
    await delay(100);
    return {
      user: mockStore.getActiveUser(),
      role: mockStore.getActiveRole(),
      clinic: mockStore.getActiveClinic(),
    };
  },

  // Public Catalog
  getDoctors: async (clinicId?: string): Promise<Doctor[]> => {
    await delay(150);
    return mockStore.getDoctors(clinicId);
  },

  getDoctorById: async (id: string): Promise<Doctor | undefined> => {
    await delay(100);
    return mockStore.getDoctorById(id);
  },

  getServices: async (clinicId?: string): Promise<Service[]> => {
    await delay(150);
    return mockStore.getServices(clinicId);
  },

  getAvailableSlots: async (
    doctorId: string,
    date: string,
    serviceId?: string
  ): Promise<TimeSlot[]> => {
    await delay(180);
    return mockStore.getAvailableSlots(doctorId, date, serviceId);
  },

  lockSlot: async (
    doctorId: string,
    date: string,
    time: string
  ): Promise<{ success: boolean }> => {
    await delay(100);
    const success = mockStore.lockSlot(doctorId, date, time);
    return { success };
  },

  // Appointments
  getAppointments: async (filters?: {
    doctorId?: string;
    patientId?: string;
    date?: string;
    status?: AppointmentStatus;
  }): Promise<Appointment[]> => {
    await delay(200);
    return mockStore.getAppointments(filters);
  },

  createAppointment: async (
    params: Parameters<typeof mockStore.createAppointment>[0]
  ): Promise<Appointment> => {
    await delay(250);
    return mockStore.createAppointment(params);
  },

  updateAppointmentStatus: async (
    id: string,
    status: AppointmentStatus,
    reason?: string
  ): Promise<Appointment | undefined> => {
    await delay(150);
    return mockStore.updateAppointmentStatus(id, status, reason);
  },

  rescheduleAppointment: async (
    id: string,
    newDate: string,
    newTime: string
  ): Promise<Appointment | undefined> => {
    await delay(200);
    return mockStore.rescheduleAppointment(id, newDate, newTime);
  },

  // Consultations
  getConsultation: async (appointmentId: string): Promise<Consultation | undefined> => {
    await delay(120);
    return mockStore.getConsultationByAppointment(appointmentId);
  },

  saveConsultation: async (
    data: Omit<Consultation, 'id' | 'createdAt'>
  ): Promise<Consultation> => {
    await delay(250);
    return mockStore.saveConsultation(data);
  },

  // Enquiries
  getEnquiries: async (): Promise<Enquiry[]> => {
    await delay(150);
    return mockStore.getEnquiries();
  },

  submitEnquiry: async (
    data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>
  ): Promise<Enquiry> => {
    await delay(200);
    return mockStore.submitEnquiry(data);
  },

  updateEnquiry: async (
    id: string,
    updates: Parameters<typeof mockStore.updateEnquiry>[1]
  ): Promise<Enquiry | undefined> => {
    await delay(150);
    return mockStore.updateEnquiry(id, updates);
  },

  // Clinic Admin
  updateBranding: async (
    clinicId: string,
    branding: Partial<ClinicBranding>
  ): Promise<void> => {
    await delay(200);
    mockStore.updateClinicBranding(clinicId, branding);
  },

  updateSettings: async (
    clinicId: string,
    settings: Partial<ClinicSettings>
  ): Promise<void> => {
    await delay(200);
    mockStore.updateClinicSettings(clinicId, settings);
  },

  // Content
  getTestimonials: async () => mockStore.getTestimonials(),
  getFAQs: async () => mockStore.getFAQs(),
  getBlogs: async () => mockStore.getBlogs(),
  getPlans: async () => mockStore.getPlans(),
};
