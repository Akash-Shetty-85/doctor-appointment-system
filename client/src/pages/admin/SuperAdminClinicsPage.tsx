import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import {
  Building2,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Layers,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Clinic } from '../../types';

export const SuperAdminClinicsPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinics = mockStore.getClinics();

  const handleToggleStatus = (clinic: Clinic) => {
    const nextStatus = clinic.status === 'Active' ? 'Suspended' : 'Active';
    clinic.status = nextStatus;
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded">
            Multi-Tenant Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Registered Clinics & Hospital Tenants
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review clinic onboarding requests, verify medical licenses, manage subdomains and enforce tenant suspension.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {clinics.map((c) => {
          const isActive = c.status === 'Active';
          return (
            <Card
              key={c.id}
              className="bg-slate-950 border-slate-800 p-6 text-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-lg">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{c.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Subdomain: <span className="text-sky-400">{c.subdomain}.medibook.platform</span>
                      {c.customDomain && (
                        <span className="text-emerald-400 ml-2">({c.customDomain})</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
                  <span>Reg: <strong className="text-slate-300 font-mono">{c.registrationNo}</strong></span>
                  <span>•</span>
                  <span>Plan: <strong className="text-amber-300 font-semibold uppercase">{c.planId}</strong></span>
                  <span>•</span>
                  <span>Branches: {c.branches.length}</span>
                  <span>•</span>
                  <span>Departments: {c.departments.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <Badge
                  variant={isActive ? 'success' : 'danger'}
                  className="uppercase text-[11px]"
                >
                  {c.status}
                </Badge>

                <Button
                  size="sm"
                  variant={isActive ? 'ghost' : 'outline'}
                  onClick={() => handleToggleStatus(c)}
                  className={`text-xs ${
                    isActive
                      ? 'text-rose-400 hover:bg-rose-950 hover:text-rose-300'
                      : 'text-emerald-400 border-emerald-500/50 hover:bg-emerald-950'
                  }`}
                >
                  {isActive ? 'Suspend Tenant' : 'Reactivate Tenant'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
