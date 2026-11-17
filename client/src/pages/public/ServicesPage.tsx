import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStore } from '../../lib/mockStore';
import { Clock, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const ServicesPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const services = mockStore.getServices();

  const filteredServices = services.filter((s) => {
    const matchesDept = selectedDept === 'all' || s.departmentId === selectedDept;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
          Treatments & Procedures
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Clinical Services at {clinic.name}
        </h1>
        <p className="text-sm text-slate-600">
          Book certified medical diagnostics, consultations, and surgical evaluations with transparent pricing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search treatments or tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Department Pills */}
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDept === 'all'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Departments
          </button>
          {clinic.departments.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDept(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDept === d.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => {
          const dept = clinic.departments.find((d) => d.id === srv.departmentId);
          return (
            <Card key={srv.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{dept?.name || 'General'}</Badge>
                  <span className="font-extrabold text-slate-900 text-base">₹{srv.price}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
                {srv.preparationInstructions && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{srv.preparationInstructions}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{srv.durationMinutes} minutes slot</span>
                </span>
                <Link to={`/book?serviceId=${srv.id}`}>
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-xs">
                    Book Service
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
