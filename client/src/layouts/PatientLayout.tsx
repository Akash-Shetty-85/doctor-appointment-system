import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { mockStore } from '../lib/mockStore';
import {
  Calendar,
  FileText,
  Users,
  ShieldCheck,
  PlusCircle,
  ArrowLeft,
  User,
  LogOut,
  Building2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PatientLayout: React.FC = () => {
  const [, setTick] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const user = mockStore.getActiveUser();

  const navItems = [
    { label: 'My Appointments', path: '/patient/dashboard', icon: Calendar },
    { label: 'Prescriptions & Records', path: '/patient/prescriptions', icon: FileText },
    { label: 'Family Members', path: '/patient/family', icon: Users },
    { label: 'Privacy & Consents', path: '/patient/consents', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Patient Portal Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-medium">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Clinic Site</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{clinic.name}</span>
              <span className="bg-sky-50 text-sky-700 text-xs px-2 py-0.5 rounded-full font-medium">
                Patient Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/book">
              <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-xs">
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                New Appointment
              </Button>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 overflow-x-auto border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-sky-600 text-sky-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
