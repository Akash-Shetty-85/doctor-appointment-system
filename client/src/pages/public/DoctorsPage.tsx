import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStore } from '../../lib/mockStore';
import { Award, Calendar, CheckCircle2, Search, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const DoctorsPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const doctors = mockStore.getDoctors();

  const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
          Medical Faculty
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Our Specialist Doctors
        </h1>
        <p className="text-sm text-slate-600">
          Meet our board-certified medical team dedicated to evidence-based healthcare.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDept === 'all'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Specialties
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

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => {
          const dept = clinic.departments.find((d) => d.id === doc.departmentId);
          return (
            <Card key={doc.id} className="flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={doc.photoUrl}
                    alt={doc.name}
                    className="w-20 h-24 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                  />
                  <div className="space-y-1">
                    <Badge variant="info" className="text-[10px]">
                      {dept?.name}
                    </Badge>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-sky-700 font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{doc.qualifications}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {doc.bio}
                </p>

                {/* Experience & Schedule Info */}
                <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      Experience:
                    </span>
                    <span className="font-bold text-slate-800">{doc.experienceYears} Years</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-sky-500" />
                      Hours:
                    </span>
                    <span className="font-medium text-slate-700">
                      {doc.workingHours.start} - {doc.workingHours.end}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Days:</span>
                    <div className="flex gap-1">
                      {daysMap.map((day, idx) => {
                        const isAvail = doc.availableDays.includes(idx);
                        return (
                          <span
                            key={day}
                            className={`text-[9px] px-1 py-0.5 rounded font-mono font-semibold ${
                              isAvail
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200/50 text-slate-400'
                            }`}
                          >
                            {day.charAt(0)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Consultation Fee
                  </span>
                  <span className="font-extrabold text-slate-900 text-base">
                    ₹{doc.consultationFee}
                  </span>
                </div>
                <Link to={`/book?doctorId=${doc.id}`}>
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Book Slot
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
