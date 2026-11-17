import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { mockStore } from '../lib/mockStore';
import {
  Users,
  Calendar,
  Clock,
  Settings,
  FileText,
  UserCheck,
  Stethoscope,
  BarChart3,
  Layers,
  Inbox,
  ArrowLeft,
  Building,
  Shield,
  Palette,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const StaffLayout: React.FC = () => {
  const [, setTick] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const user = mockStore.getActiveUser();
  const role = mockStore.getActiveRole();

  // Role-based Nav Configuration
  const getNavItems = () => {
    if (role === 'RECEPTIONIST') {
      return [
        { label: "Today's Queue & Bookings", path: '/staff/reception', icon: Clock },
        { label: 'Enquiry Leads Inbox', path: '/staff/reception/enquiries', icon: Inbox },
        { label: 'All Appointments', path: '/staff/reception/all-appointments', icon: Calendar },
      ];
    }
    if (role === 'DOCTOR') {
      return [
        { label: 'My Consultation Queue', path: '/staff/doctor', icon: Stethoscope },
        { label: 'Schedule & Leaves', path: '/staff/doctor/schedule', icon: Calendar },
      ];
    }
    // Clinic Admin default
    return [
      { label: 'Clinic Dashboard', path: '/staff/admin', icon: BarChart3 },
      { label: 'Doctors & Services', path: '/staff/admin/catalog', icon: Stethoscope },
      { label: 'Branding & Website CMS', path: '/staff/admin/cms', icon: Palette },
      { label: 'Clinic Settings & Hours', path: '/staff/admin/settings', icon: Settings },
      { label: 'Staff Management', path: '/staff/admin/staff', icon: Users },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Public Site</span>
            </Link>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{clinic.name}</span>
              <span className="text-slate-400 text-xs hidden md:inline">
                ({clinic.branches[0]?.name})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="purple" className="uppercase tracking-wider text-[10px]">
              {role.replace('_', ' ')}
            </Badge>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400">{user.email || user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Navigation Bar */}
        <div className="bg-slate-800 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
          <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-4 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-sky-400 text-sky-400 font-semibold'
                      : 'border-transparent text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Staff Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
