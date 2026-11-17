import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { ShieldCheck, HeartHandshake, Award, Users, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const AboutPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
          About Our Hospital
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Welcome to {clinic.name}
        </h1>
        <p className="text-sm text-slate-600">
          Dedicated to providing ethical, advanced, and affordable medical care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">
            Our Mission & Patient-First Vision
          </h2>
          <p>
            Founded with the belief that quality healthcare should be transparent and accessible,{' '}
            <strong className="text-slate-800">{clinic.name}</strong> brings together top specialists,
            state-of-the-art diagnostic imaging, and seamless digital booking to eliminate long hospital queues.
          </p>
          <p>
            Whether visiting our outpatient clinics, scheduling routine vaccinations for your child,
            or consulting on complex cardiovascular and orthopedic surgery, our team follows strict clinical guidelines
            to ensure optimal patient recovery.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
              <h3 className="font-extrabold text-2xl text-sky-700">10k+</h3>
              <p className="text-xs text-slate-600 font-medium">Patients Treated</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <h3 className="font-extrabold text-2xl text-emerald-700">99.4%</h3>
              <p className="text-xs text-slate-600 font-medium">Positive Clinical Outcome</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-6 space-y-3 border-l-4 border-l-sky-600">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="h-5 w-5 text-sky-600" />
              <span>Accreditation & Standards</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operating under state medical registration <span className="font-mono font-semibold text-slate-800">{clinic.registrationNo}</span>.
              Strict compliance with sterilization protocols, patient data privacy (DPDP Act 2023), and electronic health record security.
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-l-4 border-l-emerald-600">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <HeartHandshake className="h-5 w-5 text-emerald-600" />
              <span>Zero-Wait Token System</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our live digital queue system ensures you and your loved ones are informed of queue position in real time,
              preventing crowded reception lobbies.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
