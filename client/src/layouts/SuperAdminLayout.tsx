import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { mockStore } from '../lib/mockStore';
import {
  ShieldAlert,
  Building2,
  Layers,
  BarChart2,
  ArrowLeft,
  Settings,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const SuperAdminLayout: React.FC = () => {
  const [, setTick] = useState(0);
  const location = useLocation();

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const navItems = [
    { label: 'Clinics & Approvals', path: '/super-admin', icon: Building2 },
    { label: 'Platform Analytics', path: '/super-admin/analytics', icon: BarChart2 },
    { label: 'SaaS Plans & Flags', path: '/super-admin/plans', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Public Site</span>
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="font-bold text-white text-base">MediBook Super Admin Console</span>
            </div>
          </div>

          <Badge variant="warning" className="uppercase font-mono text-[10px]">
            Platform Owner
          </Badge>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-amber-400 text-amber-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
