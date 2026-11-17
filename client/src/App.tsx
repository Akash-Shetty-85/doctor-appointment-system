import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { PatientLayout } from './layouts/PatientLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { SuperAdminLayout } from './layouts/SuperAdminLayout';

// Common
import { DevToolbar } from './components/common/DevToolbar';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { DoctorsPage } from './pages/public/DoctorsPage';
import { ContactPage } from './pages/public/ContactPage';
import { AboutPage } from './pages/public/AboutPage';
import { FAQPage } from './pages/public/FAQPage';
import { BlogPage } from './pages/public/BlogPage';
import { BookingPage } from './pages/public/BookingPage';

// Patient Pages
import { PatientDashboardPage } from './pages/patient/PatientDashboardPage';
import { PatientPrescriptionsPage } from './pages/patient/PatientPrescriptionsPage';
import { PatientFamilyPage } from './pages/patient/PatientFamilyPage';
import { PatientConsentsPage } from './pages/patient/PatientConsentsPage';

// Staff Pages
import { ReceptionQueuePage } from './pages/staff/ReceptionQueuePage';
import { ReceptionEnquiriesPage } from './pages/staff/ReceptionEnquiriesPage';
import { DoctorQueuePage } from './pages/staff/DoctorQueuePage';
import { DoctorSchedulePage } from './pages/staff/DoctorSchedulePage';
import { ClinicAdminDashboardPage } from './pages/staff/ClinicAdminDashboardPage';
import { ClinicAdminCatalogPage } from './pages/staff/ClinicAdminCatalogPage';
import { ClinicAdminCMSPage } from './pages/staff/ClinicAdminCMSPage';
import { ClinicAdminSettingsPage } from './pages/staff/ClinicAdminSettingsPage';
import { ClinicAdminStaffPage } from './pages/staff/ClinicAdminStaffPage';

// Super Admin Pages
import { SuperAdminClinicsPage } from './pages/admin/SuperAdminClinicsPage';
import { SuperAdminAnalyticsPage } from './pages/admin/SuperAdminAnalyticsPage';
import { SuperAdminPlansPage } from './pages/admin/SuperAdminPlansPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Clinic Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/book" element={<BookingPage />} />
        </Route>

        {/* 2. Patient Portal */}
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboardPage />} />
          <Route path="prescriptions" element={<PatientPrescriptionsPage />} />
          <Route path="family" element={<PatientFamilyPage />} />
          <Route path="consents" element={<PatientConsentsPage />} />
        </Route>

        {/* 3. Clinic Staff Portal */}
        <Route path="/staff" element={<StaffLayout />}>
          {/* Reception */}
          <Route path="reception" element={<ReceptionQueuePage />} />
          <Route path="reception/enquiries" element={<ReceptionEnquiriesPage />} />
          <Route path="reception/all-appointments" element={<ReceptionQueuePage />} />

          {/* Doctor */}
          <Route path="doctor" element={<DoctorQueuePage />} />
          <Route path="doctor/schedule" element={<DoctorSchedulePage />} />

          {/* Clinic Admin */}
          <Route path="admin" element={<ClinicAdminDashboardPage />} />
          <Route path="admin/catalog" element={<ClinicAdminCatalogPage />} />
          <Route path="admin/cms" element={<ClinicAdminCMSPage />} />
          <Route path="admin/settings" element={<ClinicAdminSettingsPage />} />
          <Route path="admin/staff" element={<ClinicAdminStaffPage />} />
        </Route>

        {/* 4. Super Admin Console */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminClinicsPage />} />
          <Route path="analytics" element={<SuperAdminAnalyticsPage />} />
          <Route path="plans" element={<SuperAdminPlansPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Demo Role & Tenant Switcher */}
      <DevToolbar />
    </BrowserRouter>
  );
}
