import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Settings, Save, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const ClinicAdminSettingsPage: React.FC = () => {
  const [, setTick] = useState(0);
  const clinic = mockStore.getActiveClinic();
  const settings = clinic.settings;

  const [openTime, setOpenTime] = useState(settings.workingHours.open);
  const [closeTime, setCloseTime] = useState(settings.workingHours.close);
  const [slotDuration, setSlotDuration] = useState(settings.slotDurationMinutes);
  const [bookingPolicy, setBookingPolicy] = useState(settings.bookingPolicy);
  const [cancelHours, setCancelHours] = useState(settings.cancellationCutoffHours);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateClinicSettings(clinic.id, {
      workingHours: {
        ...settings.workingHours,
        open: openTime,
        close: closeTime,
      },
      slotDurationMinutes: Number(slotDuration),
      bookingPolicy,
      cancellationCutoffHours: Number(cancelHours),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Clinic Operations & Booking Policy Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure working hours, slot durations, auto-confirmation vs approval, and cancellation limits.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Operational settings updated successfully!</span>
        </div>
      )}

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Daily Working Hours & Slot Intervals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Slot Duration
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Booking Policy & Cancellation Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Online Booking Confirmation Policy
                </label>
                <select
                  value={bookingPolicy}
                  onChange={(e) => setBookingPolicy(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="auto-confirm">Instant Auto-Confirmation (Issue Token)</option>
                  <option value="receptionist-approval">Requires Receptionist Approval (Pending)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  When auto-confirm is selected, patients receive an immediate confirmed queue token.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Cancellation Cutoff (Hours Before Slot)
                </label>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={cancelHours}
                  onChange={(e) => setCancelHours(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Patients cannot self-cancel within this window.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
              <Save className="h-4 w-4 mr-1.5" />
              Save Operational Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
