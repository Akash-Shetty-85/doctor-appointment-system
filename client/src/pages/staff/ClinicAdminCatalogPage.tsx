import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Stethoscope, Plus, Clock, Award, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const ClinicAdminCatalogPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'doctors' | 'services'>('doctors');

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const doctors = mockStore.getDoctors();
  const services = mockStore.getServices();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Medical Faculty & Services Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your clinic's accredited doctors, consultation fees, and clinical service offerings.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'doctors'
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'services'
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Services ({services.length})
          </button>
        </div>
      </div>

      {activeTab === 'doctors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <Card key={doc.id} className="p-5 flex items-start gap-4">
              <img
                src={doc.photoUrl}
                alt={doc.name}
                className="w-20 h-24 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{doc.specialization}</Badge>
                  <span className="font-bold text-slate-900 text-sm">₹{doc.consultationFee}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                  {doc.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">{doc.qualifications}</p>
                <div className="text-xs text-slate-600 flex items-center gap-3 pt-1">
                  <span>{doc.experienceYears}y exp</span>
                  <span>•</span>
                  <span>Hours: {doc.workingHours.start} - {doc.workingHours.end}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv) => (
            <Card key={srv.id} className="p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {srv.durationMinutes} mins
                  </span>
                  <span className="font-bold text-slate-900 text-sm">₹{srv.price}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
              </div>
              <Badge variant="success" className="self-start">
                Active in Booking
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
