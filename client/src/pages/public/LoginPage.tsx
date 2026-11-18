import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockStore } from '../../lib/mockStore';
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Building2,
  Stethoscope,
  UserCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const clinic = mockStore.getActiveClinic();

  const [activeTab, setActiveTab] = useState<'patient' | 'staff'>('patient');

  // Patient OTP State
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [patientLoading, setPatientLoading] = useState(false);

  // Staff Login State
  const [staffEmail, setStaffEmail] = useState('arvind.rao@apexhealthcare.com');
  const [staffPassword, setStaffPassword] = useState('••••••••');
  const [staffLoading, setStaffLoading] = useState(false);

  // Patient Send OTP handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setPatientLoading(true);
    setTimeout(() => {
      setPatientLoading(false);
      setOtpSent(true);
    }, 600);
  };

  // Patient Verify OTP handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientLoading(true);
    setTimeout(() => {
      setPatientLoading(false);
      // Log in as default patient (Rahul Verma)
      mockStore.switchRole('PATIENT');
      navigate('/patient/dashboard');
    }, 600);
  };

  // Staff Submit handler
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffLoading(true);
    setTimeout(() => {
      setStaffLoading(false);
      dispatchStaffLogin(staffEmail);
    }, 600);
  };

  const dispatchStaffLogin = (email: string) => {
    if (email.includes('superadmin')) {
      mockStore.switchRole('SUPER_ADMIN');
      navigate('/super-admin');
    } else if (email.includes('admin')) {
      mockStore.switchRole('CLINIC_ADMIN');
      navigate('/staff/admin');
    } else if (email.includes('reception')) {
      mockStore.switchRole('RECEPTIONIST');
      navigate('/staff/reception');
    } else {
      // Default Doctor
      mockStore.switchRole('DOCTOR');
      navigate('/staff/doctor');
    }
  };

  const quickStaffLogin = (role: 'RECEPTIONIST' | 'DOCTOR' | 'CLINIC_ADMIN' | 'SUPER_ADMIN') => {
    mockStore.switchRole(role);
    if (role === 'RECEPTIONIST') navigate('/staff/reception');
    if (role === 'DOCTOR') navigate('/staff/doctor');
    if (role === 'CLINIC_ADMIN') navigate('/staff/admin');
    if (role === 'SUPER_ADMIN') navigate('/super-admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-sky-600 font-extrabold text-2xl">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white text-base">
              {clinic.name.charAt(0)}
            </div>
            <span>{clinic.name}</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-slate-500">
            Access your medical bookings, doctor schedule, or clinic workspace.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('patient')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'patient'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Patient (Phone OTP)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'staff'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Staff & Admin</span>
          </button>
        </div>

        {/* Tab 1: Patient Login Form */}
        {activeTab === 'patient' && (
          <Card className="p-6 sm:p-8 space-y-5 border-slate-200 shadow-md">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    Passwordless Mobile Login
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Enter your registered 10-digit mobile number to receive a one-time passcode.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-900"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={patientLoading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-sm py-2.5"
                >
                  <span>Send Verification Code</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>

                <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-800 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    Demo patient account pre-configured for <strong>Rahul Verma</strong>. Click send code to proceed.
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      OTP Sent to {phoneNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-sky-600 hover:underline"
                    >
                      Change Phone
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Enter the 6-digit verification code sent to your phone.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    6-Digit Security Code
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1 2 3 4 5 6"
                    className="w-full text-center tracking-[0.5em] text-lg font-bold py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="text-[11px] text-slate-400 text-center mt-1">
                    Demo Mode: Enter any 6 digits (e.g. 123456)
                  </p>
                </div>

                <Button
                  type="submit"
                  isLoading={patientLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm py-2.5"
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Verify & Open Patient Portal
                </Button>
              </form>
            )}
          </Card>
        )}

        {/* Tab 2: Staff & Admin Login Form */}
        {activeTab === 'staff' && (
          <Card className="p-6 sm:p-8 space-y-5 border-slate-200 shadow-md">
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Clinical & Operations Portal
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Sign in with your authorized hospital credentials.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    required
                    type="email"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    required
                    type="password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={staffLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-sm py-2.5 text-white"
              >
                Sign In to Staff Workspace
              </Button>
            </form>

            {/* 1-Click Demo Profiles */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                Or Instant 1-Click Staff Demo Login
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => quickStaffLogin('RECEPTIONIST')}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left flex items-center gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Receptionist</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickStaffLogin('DOCTOR')}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left flex items-center gap-1.5"
                >
                  <Stethoscope className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">Doctor (Arvind)</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickStaffLogin('CLINIC_ADMIN')}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left flex items-center gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">Clinic Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => quickStaffLogin('SUPER_ADMIN')}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-left flex items-center gap-1.5"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">Super Admin</span>
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
