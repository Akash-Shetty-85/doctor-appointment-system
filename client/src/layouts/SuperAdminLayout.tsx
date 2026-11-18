import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { mockStore } from '../lib/mockStore';
import {
  ShieldAlert,
  Building2,
  Layers,
  BarChart2,
  LogOut,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const SuperAdminLayout: React.FC = () => {
  const [, setTick] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const handleLogout = () => {
    mockStore.logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Clinics & Approvals', path: '/super-admin', icon: Building2 },
    { label: 'Platform Analytics', path: '/super-admin/analytics', icon: BarChart2 },
    { label: 'SaaS Plans & Flags', path: '/super-admin/plans', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base block leading-tight">
                MediBook Super Admin Console
              </span>
              <span className="text-[11px] text-slate-400">
                Multi-Tenant SaaS Governance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="warning" className="uppercase font-mono text-[10px]">
              Platform Owner
            </Badge>

            {/* Logout is the only exit to the public site */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-colors font-semibold"
              title="Logout to view Public Site"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
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
