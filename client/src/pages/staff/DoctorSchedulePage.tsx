import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Calendar, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const DoctorSchedulePage: React.FC = () => {
  const [, setTick] = useState(0);
  const activeDoctor = mockStore.getDoctors()[0];

  const [leaves, setLeaves] = useState<string[]>(activeDoctor?.leaves || []);
  const [newLeaveDate, setNewLeaveDate] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveDate || leaves.includes(newLeaveDate)) return;
    const updated = [...leaves, newLeaveDate];
    setLeaves(updated);
    activeDoctor.leaves = updated;
    setNewLeaveDate('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRemoveLeave = (dateStr: string) => {
    const updated = leaves.filter((d) => d !== dateStr);
    setLeaves(updated);
    activeDoctor.leaves = updated;
    setTick((t) => t + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Consultation Hours & Planned Leaves
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your active weekly slots, lunchtime breaks, and emergency leave blocks.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Doctor leave schedule updated! Slots on blocked dates will not appear for patients.</span>
        </div>
      )}

      {/* Weekly Schedule Overview */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Weekly Working Hours ({activeDoctor.name})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-400 block font-medium">Daily Shift:</span>
            <span className="font-bold text-slate-900 text-sm">
              {activeDoctor.workingHours.start} - {activeDoctor.workingHours.end}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-400 block font-medium">Lunch Break:</span>
            <span className="font-bold text-slate-900 text-sm">
              {activeDoctor.breakTimes[0]?.start} - {activeDoctor.breakTimes[0]?.end}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 col-span-2">
            <span className="text-slate-400 block font-medium">Available Working Days:</span>
            <div className="flex gap-1.5 mt-1">
              {days.map((day, idx) => (
                <span
                  key={day}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    activeDoctor.availableDays.includes(idx)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Planned Leaves & Emergency Block Slots */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Block Dates / Leaves
        </h3>
        <form onSubmit={handleAddLeave} className="flex gap-3 items-end">
          <div className="flex-1 sm:max-w-xs">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Leave Date
            </label>
            <input
              required
              type="date"
              value={newLeaveDate}
              onChange={(e) => setNewLeaveDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
            />
          </div>
          <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
            <Plus className="h-4 w-4 mr-1" />
            Block Out Date
          </Button>
        </form>

        <div className="pt-2">
          {leaves.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No leaves scheduled. Available on all active days.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {leaves.map((dateStr) => (
                <div
                  key={dateStr}
                  className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3 py-1.5 rounded-lg font-semibold"
                >
                  <span>{dateStr} (Blocked)</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLeave(dateStr)}
                    className="text-rose-500 hover:text-rose-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
