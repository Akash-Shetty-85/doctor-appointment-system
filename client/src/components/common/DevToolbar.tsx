import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '../../lib/mockStore';
import { Role } from '../../types';
import { Sparkles, Building2, UserCircle, RefreshCw, LayoutDashboard, ChevronDown } from 'lucide-react';

export const DevToolbar: React.FC = () => {
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeClinic = mockStore.getActiveClinic();
  const activeUser = mockStore.getActiveUser();
  const activeRole = mockStore.getActiveRole();
  const clinics = mockStore.getClinics();

  const roles: { role: Role; label: string; route: string }[] = [
    { role: 'PATIENT', label: 'Patient (Rahul)', route: '/patient/dashboard' },
    { role: 'RECEPTIONIST', label: 'Receptionist (Sunita)', route: '/staff/reception' },
    { role: 'DOCTOR', label: 'Doctor (Dr. Arvind)', route: '/staff/doctor' },
    { role: 'CLINIC_ADMIN', label: 'Clinic Admin (Dr. Vikram)', route: '/staff/admin' },
    { role: 'SUPER_ADMIN', label: 'Super Admin', route: '/super-admin' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-slate-900/90 text-white px-4 py-2.5 shadow-xl hover:bg-slate-900 border border-slate-700 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Demo Role & Tenant Switcher</span>
          <span className="bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded text-[10px]">
            {activeRole}
          </span>
        </button>
      ) : (
        <div className="w-80 rounded-2xl bg-slate-900/95 text-white p-4 shadow-2xl border border-slate-700/80 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-150 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Multi-Tenant Sandbox Toolbar</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Switch Tenant / Clinic */}
          <div className="mt-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
              <Building2 className="h-3 w-3 text-sky-400" />
              Active Clinic / Tenant
            </label>
            <select
              value={activeClinic.id}
              onChange={(e) => {
                mockStore.setActiveClinic(e.target.value);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.subdomain})
                </option>
              ))}
            </select>
          </div>

          {/* Switch Role */}
          <div className="mt-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
              <UserCircle className="h-3 w-3 text-emerald-400" />
              Switch Role & View
            </label>
            <div className="grid grid-cols-1 gap-1">
              {roles.map((r) => {
                const isSelected = activeRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      mockStore.switchRole(r.role);
                      navigate(r.route);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <span>{r.label}</span>
                    {isSelected && <span className="text-[10px] opacity-75">Active</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-sky-300 flex items-center gap-1"
            >
              <LayoutDashboard className="h-3 w-3" />
              Public Clinic Site
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo appointments and settings to seed defaults?')) {
                  mockStore.resetToDefault();
                }
              }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
              title="Reset data"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
