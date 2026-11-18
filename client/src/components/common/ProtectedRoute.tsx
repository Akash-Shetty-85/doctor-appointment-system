import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { mockStore } from '../../lib/mockStore';
import { Role } from '../../types';
import { ShieldAlert, ArrowLeft, LogIn, Sparkles, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const [, setTick] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeUser = mockStore.getActiveUser();
  const activeRole = mockStore.getActiveRole();

  // 1. If not logged in at all -> redirect directly to Login
  if (!activeUser || !activeRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If logged in, check role authorization
  const isAuthorized = allowedRoles.includes(activeRole);

  if (!isAuthorized) {
    const handleLogout = () => {
      mockStore.logout();
      navigate('/');
    };

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
              403 • Access Denied
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Role Permission Required
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are currently signed in as{' '}
              <strong className="text-amber-400 font-semibold">{activeRole.replace('_', ' ')}</strong> ({activeUser.name}),
              but accessing this portal strictly requires one of the following roles:
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 py-2">
            {allowedRoles.map((role) => (
              <span
                key={role}
                className="text-xs font-mono font-bold bg-slate-800 text-sky-400 px-3 py-1 rounded-lg border border-slate-700"
              >
                {role}
              </span>
            ))}
          </div>

          {/* Quick switch suggestion */}
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2 text-left">
            <p className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Sandbox Role Switcher:</span>
            </p>
            <p className="text-[11px]">
              Use the floating <strong>"Demo Role Switcher"</strong> at the bottom-right or switch accounts below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full text-xs text-rose-300 border-rose-900/60 hover:bg-rose-950/50"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              Logout & Return Home
            </Button>
            <Link to="/login" className="w-full">
              <Button className="w-full text-xs bg-sky-600 hover:bg-sky-700">
                <LogIn className="h-3.5 w-3.5 mr-1" />
                Switch Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
