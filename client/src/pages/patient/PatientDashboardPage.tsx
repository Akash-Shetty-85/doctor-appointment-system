import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStore } from '../../lib/mockStore';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  AlertTriangle,
  PlusCircle,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Appointment } from '../../types';

export const PatientDashboardPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  // Modals
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeUser = mockStore.getActiveUser();
  if (!activeUser) return null;

  const appointments = mockStore.getAppointments({ patientId: activeUser.id });

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingAppointments = appointments.filter(
    (a) => !['Completed', 'Cancelled', 'No-show'].includes(a.status)
  );

  const pastAppointments = appointments.filter((a) =>
    ['Completed', 'Cancelled', 'No-show'].includes(a.status)
  );

  const displayedList =
    activeTab === 'upcoming'
      ? upcomingAppointments
      : activeTab === 'past'
      ? pastAppointments
      : appointments;

  const handleConfirmCancel = () => {
    if (!cancelModalApt) return;
    mockStore.updateAppointmentStatus(
      cancelModalApt.id,
      'Cancelled',
      cancelReason || 'Patient requested cancellation'
    );
    setCancelModalApt(null);
    setCancelReason('');
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleModalApt || !newDate || !newTime) return;
    mockStore.rescheduleAppointment(rescheduleModalApt.id, newDate, newTime);
    setRescheduleModalApt(null);
    setNewDate('');
    setNewTime('');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Welcome back, {activeUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your consultations, queue tokens, and digital prescriptions in one place.
          </p>
        </div>
        <Link to="/book">
          <Button className="bg-sky-600 hover:bg-sky-700">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-sky-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming Bookings ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'past'
              ? 'bg-sky-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Past & Completed ({pastAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-sky-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({appointments.length})
        </button>
      </div>

      {/* Appointments List */}
      {displayedList.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 space-y-3">
          <Calendar className="h-10 w-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No appointments found</p>
          <p className="text-xs text-slate-400">
            You don't have any appointments in this view.
          </p>
          <Link to="/book">
            <Button size="sm" className="mt-2">
              Book Your First Appointment
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedList.map((apt) => {
            const isCompleted = apt.status === 'Completed';
            const isCancelled = apt.status === 'Cancelled';
            const isPending = apt.status === 'Pending';
            const isCheckedIn = apt.status === 'Checked-in';

            return (
              <Card
                key={apt.id}
                className="p-5 sm:p-6 transition-all hover:border-slate-300 space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    {apt.tokenNumber && (
                      <div className="px-3 py-1 bg-sky-50 text-sky-700 rounded-lg text-center border border-sky-100">
                        <span className="text-[9px] uppercase font-bold block text-slate-400">Token</span>
                        <span className="text-lg font-black leading-none">#{apt.tokenNumber}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{apt.doctorName}</h3>
                      <p className="text-xs text-sky-700 font-semibold">{apt.serviceName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge status={apt.status}>{apt.status}</Badge>
                    <span className="text-xs text-slate-400 uppercase font-mono">
                      Ref: {apt.id}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-sky-500 shrink-0" />
                    <span>
                      <strong className="text-slate-800">Date:</strong> {apt.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sky-500 shrink-0" />
                    <span>
                      <strong className="text-slate-800">Time:</strong> {apt.time} ({apt.durationMinutes}m)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-sky-500 shrink-0" />
                    <span>
                      <strong className="text-slate-800">Patient:</strong> {apt.patientName} ({apt.forWhom})
                    </span>
                  </div>
                </div>

                {apt.patientNotes && (
                  <p className="text-xs text-slate-500 italic">
                    Note: "{apt.patientNotes}"
                  </p>
                )}

                {apt.cancellationReason && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                    Reason for Cancellation: {apt.cancellationReason}
                  </p>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="text-xs text-slate-500">
                    {isCheckedIn && (
                      <span className="text-blue-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Checked-in at clinic. Please wait for your token to be called.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <Link to="/patient/prescriptions">
                        <Button size="sm" variant="outline" className="text-xs">
                          <FileText className="h-3.5 w-3.5 mr-1 text-sky-600" />
                          View Prescription
                        </Button>
                      </Link>
                    )}

                    {!isCompleted && !isCancelled && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRescheduleModalApt(apt);
                            setNewDate(apt.date);
                            setNewTime(apt.time);
                          }}
                          className="text-xs"
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCancelModalApt(apt)}
                          className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                          Cancel Booking
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={!!cancelModalApt}
        onClose={() => setCancelModalApt(null)}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this booking?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Booking for <strong>{cancelModalApt?.doctorName}</strong> on{' '}
            <strong>{cancelModalApt?.date}</strong> at <strong>{cancelModalApt?.time}</strong>.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Reason for Cancellation
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict, feeling better..."
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setCancelModalApt(null)}>
              Keep Appointment
            </Button>
            <Button variant="danger" onClick={handleConfirmCancel}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!rescheduleModalApt}
        onClose={() => setRescheduleModalApt(null)}
        title="Reschedule Appointment"
        description="Choose a new date and time for your consultation."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Consultation with <strong>{rescheduleModalApt?.doctorName}</strong>.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              New Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              New Time Slot
            </label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="">Select a slot</option>
              {['09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRescheduleModalApt(null)}>
              Close
            </Button>
            <Button
              disabled={!newDate || !newTime}
              onClick={handleConfirmReschedule}
              className="bg-sky-600 hover:bg-sky-700"
            >
              Confirm Reschedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
