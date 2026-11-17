import {
  Clinic,
  Doctor,
  Service,
  Appointment,
  Consultation,
  Enquiry,
  User,
  Role,
  TimeSlot,
  SlotLock,
  AppointmentStatus,
  ClinicBranding,
  ClinicSettings,
} from '../types';

import {
  SEED_CLINICS,
  SEED_DOCTORS,
  SEED_SERVICES,
  SEED_USERS,
  SEED_APPOINTMENTS,
  SEED_CONSULTATIONS,
  SEED_ENQUIRIES,
  SEED_TESTIMONIALS,
  SEED_FAQS,
  SEED_BLOGS,
  SEED_PLANS,
} from './mockData';

const STORAGE_KEY = 'medibook_state_v1';

interface MockStoreState {
  clinics: Clinic[];
  doctors: Doctor[];
  services: Service[];
  users: User[];
  appointments: Appointment[];
  consultations: Consultation[];
  enquiries: Enquiry[];
  slotLocks: SlotLock[];
  activeClinicId: string;
  activeUserId: string;
}

function getInitialState(): MockStoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.clinics && parsed.appointments) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load state from localStorage, using seeds', e);
  }

  return {
    clinics: SEED_CLINICS,
    doctors: SEED_DOCTORS,
    services: SEED_SERVICES,
    users: SEED_USERS,
    appointments: SEED_APPOINTMENTS,
    consultations: SEED_CONSULTATIONS,
    enquiries: SEED_ENQUIRIES,
    slotLocks: [],
    activeClinicId: 'clinic-apex',
    activeUserId: 'usr-patient-rahul',
  };
}

class MockStore {
  private state: MockStoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = getInitialState();
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public resetToDefault() {
    this.state = {
      clinics: SEED_CLINICS,
      doctors: SEED_DOCTORS,
      services: SEED_SERVICES,
      users: SEED_USERS,
      appointments: SEED_APPOINTMENTS,
      consultations: SEED_CONSULTATIONS,
      enquiries: SEED_ENQUIRIES,
      slotLocks: [],
      activeClinicId: 'clinic-apex',
      activeUserId: 'usr-patient-rahul',
    };
    this.persist();
  }

  // --- Tenant Resolution ---
  public getActiveClinic(): Clinic {
    return (
      this.state.clinics.find((c) => c.id === this.state.activeClinicId) ||
      this.state.clinics[0]
    );
  }

  public setActiveClinic(clinicId: string) {
    this.state.activeClinicId = clinicId;
    this.persist();
  }

  public getClinics(): Clinic[] {
    return this.state.clinics;
  }

  // --- Auth / User State ---
  public getActiveUser(): User {
    return (
      this.state.users.find((u) => u.id === this.state.activeUserId) ||
      this.state.users[0]
    );
  }

  public getActiveRole(): Role {
    const user = this.getActiveUser();
    const membership = user.memberships.find(
      (m) => m.clinicId === '*' || m.clinicId === this.state.activeClinicId
    );
    return membership?.role || 'PATIENT';
  }

  public setActiveUser(userId: string) {
    this.state.activeUserId = userId;
    this.persist();
  }

  public switchRole(role: Role) {
    // Find first user matching role or default
    const targetUser = this.state.users.find((u) =>
      u.memberships.some((m) => m.role === role)
    );
    if (targetUser) {
      this.state.activeUserId = targetUser.id;
      this.persist();
    }
  }

  // --- Doctors & Services ---
  public getDoctors(clinicId?: string): Doctor[] {
    const cId = clinicId || this.state.activeClinicId;
    return this.state.doctors.filter((d) => d.clinicId === cId);
  }

  public getDoctorById(id: string): Doctor | undefined {
    return this.state.doctors.find((d) => d.id === id);
  }

  public getServices(clinicId?: string): Service[] {
    const cId = clinicId || this.state.activeClinicId;
    return this.state.services.filter((s) => s.clinicId === cId && s.active);
  }

  // --- Slot Availability Calculation ---
  public getAvailableSlots(
    doctorId: string,
    dateStr: string,
    _serviceId?: string
  ): TimeSlot[] {
    const doctor = this.getDoctorById(doctorId);
    if (!doctor) return [];

    // Parse date day of week (0=Sun, 1=Mon, ..., 6=Sat)
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (!doctor.availableDays.includes(dayOfWeek) || doctor.leaves.includes(dateStr)) {
      return [];
    }

    const clinic = this.getActiveClinic();
    const slotDuration = clinic.settings.slotDurationMinutes || 20;

    // Generate times between doctor.workingHours.start and doctor.workingHours.end
    const slots: TimeSlot[] = [];
    const parseMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const formatMins = (totalMins: number) => {
      const h = Math.floor(totalMins / 60)
        .toString()
        .padStart(2, '0');
      const m = (totalMins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    const startMins = parseMins(doctor.workingHours.start);
    const endMins = parseMins(doctor.workingHours.end);

    const now = Date.now();
    // Clean expired slot locks
    this.state.slotLocks = this.state.slotLocks.filter((l) => l.expiresAt > now);

    // Booked slots for this doctor and date
    const bookedSlots = this.state.appointments
      .filter(
        (a) =>
          a.doctorId === doctorId &&
          a.date === dateStr &&
          !['Cancelled', 'No-show'].includes(a.status)
      )
      .map((a) => a.time);

    for (let cur = startMins; cur + slotDuration <= endMins; cur += slotDuration) {
      const timeStr = formatMins(cur);

      // Check if inside break time
      const isBreak = doctor.breakTimes.some((b) => {
        const bStart = parseMins(b.start);
        const bEnd = parseMins(b.end);
        return cur >= bStart && cur < bEnd;
      });

      if (isBreak) continue;

      const isBooked = bookedSlots.includes(timeStr);
      const isLocked = this.state.slotLocks.some(
        (l) => l.doctorId === doctorId && l.date === dateStr && l.time === timeStr
      );

      slots.push({
        time: timeStr,
        available: !isBooked && !isLocked,
        isLocked,
      });
    }

    return slots;
  }

  public lockSlot(doctorId: string, date: string, time: string): boolean {
    const clinic = this.getActiveClinic();
    const lockDuration = (clinic.settings.slotLockDurationSeconds || 300) * 1000;
    const expiresAt = Date.now() + lockDuration;

    // Check if slot already locked or booked
    const isBooked = this.state.appointments.some(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.time === time &&
        !['Cancelled', 'No-show'].includes(a.status)
    );
    if (isBooked) return false;

    // Remove old locks on this slot
    this.state.slotLocks = this.state.slotLocks.filter(
      (l) => !(l.doctorId === doctorId && l.date === date && l.time === time)
    );

    this.state.slotLocks.push({
      doctorId,
      date,
      time,
      expiresAt,
      sessionId: 'sess-' + Math.random().toString(36).substring(2, 9),
    });

    this.persist();
    return true;
  }

  // --- Appointments ---
  public getAppointments(filters?: {
    clinicId?: string;
    doctorId?: string;
    patientId?: string;
    date?: string;
    status?: AppointmentStatus;
  }): Appointment[] {
    const clinicId = filters?.clinicId || this.state.activeClinicId;
    return this.state.appointments
      .filter((a) => {
        if (a.clinicId !== clinicId) return false;
        if (filters?.doctorId && a.doctorId !== filters.doctorId) return false;
        if (filters?.patientId && a.patientId !== filters.patientId) return false;
        if (filters?.date && a.date !== filters.date) return false;
        if (filters?.status && a.status !== filters.status) return false;
        return true;
      })
      .sort((a, b) => (a.date + a.time > b.date + b.time ? -1 : 1));
  }

  public createAppointment(params: {
    clinicId?: string;
    branchId: string;
    patientId: string;
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    familyMemberId?: string;
    forWhom: string;
    doctorId: string;
    serviceId: string;
    date: string;
    time: string;
    source?: 'online' | 'walk-in' | 'phone';
    patientNotes?: string;
  }): Appointment {
    const clinic = this.getActiveClinic();
    const doctor = this.getDoctorById(params.doctorId)!;
    const service = this.state.services.find((s) => s.id === params.serviceId)!;

    // Release lock if any
    this.state.slotLocks = this.state.slotLocks.filter(
      (l) =>
        !(
          l.doctorId === params.doctorId &&
          l.date === params.date &&
          l.time === params.time
        )
    );

    // Compute daily token number for today
    const todaysTokens = this.state.appointments
      .filter((a) => a.clinicId === clinic.id && a.date === params.date)
      .map((a) => a.tokenNumber || 0);
    const nextToken = todaysTokens.length > 0 ? Math.max(...todaysTokens) + 1 : 1;

    const initialStatus: AppointmentStatus =
      clinic.settings.bookingPolicy === 'auto-confirm' || params.source === 'walk-in'
        ? 'Confirmed'
        : 'Pending';

    const newAppointment: Appointment = {
      id: 'apt-' + Date.now().toString(36),
      tokenNumber: nextToken,
      clinicId: clinic.id,
      branchId: params.branchId,
      patientId: params.patientId,
      patientName: params.patientName,
      patientPhone: params.patientPhone,
      patientEmail: params.patientEmail,
      familyMemberId: params.familyMemberId,
      forWhom: params.forWhom,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialization,
      serviceId: service.id,
      serviceName: service.name,
      date: params.date,
      time: params.time,
      durationMinutes: service.durationMinutes,
      status: initialStatus,
      source: params.source || 'online',
      mode: 'in-person',
      paymentStatus: 'pending',
      patientNotes: params.patientNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.appointments.unshift(newAppointment);
    this.persist();
    return newAppointment;
  }

  public updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
    reason?: string
  ): Appointment | undefined {
    const apt = this.state.appointments.find((a) => a.id === id);
    if (!apt) return undefined;

    apt.status = status;
    apt.updatedAt = new Date().toISOString();
    if (reason && status === 'Cancelled') {
      apt.cancellationReason = reason;
    }
    this.persist();
    return apt;
  }

  public rescheduleAppointment(
    id: string,
    newDate: string,
    newTime: string
  ): Appointment | undefined {
    const apt = this.state.appointments.find((a) => a.id === id);
    if (!apt) return undefined;

    apt.rescheduledFrom = `${apt.date} ${apt.time}`;
    apt.date = newDate;
    apt.time = newTime;
    apt.status = 'Rescheduled';
    apt.updatedAt = new Date().toISOString();

    this.persist();
    return apt;
  }

  // --- Consultations ---
  public getConsultationByAppointment(appointmentId: string): Consultation | undefined {
    return this.state.consultations.find((c) => c.appointmentId === appointmentId);
  }

  public getConsultationsByPatient(patientId: string): Consultation[] {
    return this.state.consultations.filter((c) => c.patientId === patientId);
  }

  public saveConsultation(
    data: Omit<Consultation, 'id' | 'createdAt'>
  ): Consultation {
    let consultation = this.state.consultations.find(
      (c) => c.appointmentId === data.appointmentId
    );

    if (consultation) {
      Object.assign(consultation, data);
    } else {
      consultation = {
        ...data,
        id: 'cns-' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
      };
      this.state.consultations.unshift(consultation);
    }

    // Mark appointment as Completed
    this.updateAppointmentStatus(data.appointmentId, 'Completed');
    this.persist();
    return consultation;
  }

  // --- Enquiries ---
  public getEnquiries(clinicId?: string): Enquiry[] {
    const cId = clinicId || this.state.activeClinicId;
    return this.state.enquiries
      .filter((e) => e.clinicId === cId)
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }

  public submitEnquiry(data: Omit<Enquiry, 'id' | 'status' | 'createdAt'>): Enquiry {
    const newEnquiry: Enquiry = {
      ...data,
      id: 'enq-' + Date.now().toString(36),
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    this.state.enquiries.unshift(newEnquiry);
    this.persist();
    return newEnquiry;
  }

  public updateEnquiry(
    id: string,
    updates: Partial<Pick<Enquiry, 'status' | 'notes' | 'assignedToStaffId' | 'assignedToStaffName'>>
  ): Enquiry | undefined {
    const enq = this.state.enquiries.find((e) => e.id === id);
    if (!enq) return undefined;
    Object.assign(enq, updates);
    this.persist();
    return enq;
  }

  // --- Clinic Admin Settings ---
  public updateClinicBranding(clinicId: string, branding: Partial<ClinicBranding>) {
    const clinic = this.state.clinics.find((c) => c.id === clinicId);
    if (clinic) {
      clinic.branding = { ...clinic.branding, ...branding };
      this.persist();
    }
  }

  public updateClinicSettings(clinicId: string, settings: Partial<ClinicSettings>) {
    const clinic = this.state.clinics.find((c) => c.id === clinicId);
    if (clinic) {
      clinic.settings = { ...clinic.settings, ...settings };
      this.persist();
    }
  }

  // --- Content & Static Seeds ---
  public getTestimonials(clinicId?: string) {
    const cId = clinicId || this.state.activeClinicId;
    return SEED_TESTIMONIALS.filter((t) => t.clinicId === cId);
  }

  public getFAQs(clinicId?: string) {
    const cId = clinicId || this.state.activeClinicId;
    return SEED_FAQS.filter((f) => f.clinicId === cId);
  }

  public getBlogs(clinicId?: string) {
    const cId = clinicId || this.state.activeClinicId;
    return SEED_BLOGS.filter((b) => b.clinicId === cId);
  }

  public getPlans() {
    return SEED_PLANS;
  }
}

export const mockStore = new MockStore();
