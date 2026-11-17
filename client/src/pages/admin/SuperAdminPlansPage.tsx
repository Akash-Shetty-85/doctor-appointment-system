import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Layers, CheckCircle2, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const SuperAdminPlansPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const plans = mockStore.getPlans();

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded">
            Subscription Governance
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Clinic SaaS Plans & Feature Flags
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure tenant limits (doctors, branches, bookings) and toggle feature flags per subscription tier.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((p) => (
          <Card key={p.id} className="bg-slate-950 border-slate-800 p-6 text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400">{p.description}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">₹{p.priceMonthly}</span>
                <span className="text-xs text-slate-400 block">/ month</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                Resource Limits
              </h4>
              <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Max Doctors</span>
                  <span className="font-bold text-white">{p.limits.maxDoctors}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Max Branches</span>
                  <span className="font-bold text-white">{p.limits.maxBranches}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Monthly Bookings</span>
                  <span className="font-bold text-white">{p.limits.maxAppointmentsPerMonth}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                Feature Flags
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                {Object.entries(p.featureFlags).map(([flag, enabled]) => (
                  <div key={flag} className="flex items-center gap-1.5">
                    {enabled ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-slate-600 shrink-0" />
                    )}
                    <span className={enabled ? 'text-slate-200' : 'text-slate-500'}>
                      {flag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
