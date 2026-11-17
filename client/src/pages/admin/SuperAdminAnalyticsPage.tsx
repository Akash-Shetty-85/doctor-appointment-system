import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { BarChart3, TrendingUp, Building2, Calendar, Users, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const SuperAdminAnalyticsPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinics = mockStore.getClinics();
  const appointments = mockStore.getAppointments();
  const enquiries = mockStore.getEnquiries();

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded">
            Platform Metrics
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Global SaaS Health & Growth Metrics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated traffic, clinic adoption, and appointment volume across all onboarded hospital systems.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-950 border-slate-800 p-5 space-y-1 text-slate-200">
          <span className="text-xs text-slate-400 font-medium">Active Tenants</span>
          <p className="text-3xl font-black text-white">{clinics.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            100% operational
          </span>
        </Card>

        <Card className="bg-slate-950 border-slate-800 p-5 space-y-1 text-slate-200">
          <span className="text-xs text-slate-400 font-medium">Total Bookings Managed</span>
          <p className="text-3xl font-black text-sky-400">{appointments.length}</p>
          <span className="text-[11px] text-slate-400">Zero double bookings</span>
        </Card>

        <Card className="bg-slate-950 border-slate-800 p-5 space-y-1 text-slate-200">
          <span className="text-xs text-slate-400 font-medium">Inquiry Leads Generated</span>
          <p className="text-3xl font-black text-purple-400">{enquiries.length}</p>
          <span className="text-[11px] text-slate-400">Public clinic sites</span>
        </Card>

        <Card className="bg-slate-950 border-slate-800 p-5 space-y-1 text-slate-200">
          <span className="text-xs text-slate-400 font-medium">DPDP Consent Records</span>
          <p className="text-3xl font-black text-emerald-400">100%</p>
          <span className="text-[11px] text-emerald-400">Audit logs encrypted</span>
        </Card>
      </div>
    </div>
  );
};
