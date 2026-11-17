import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import {
  Users,
  CheckCircle,
  Clock,
  PlusCircle,
  Search,
  AlertCircle,
  Calendar,
  XCircle,
  Phone,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Appointment } from '../../types';

export const ReceptionQueuePage: React.FC = () => {
  const [, setTick] = useState(0);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  // Walk-in form state
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInDoctorId, setWalkInDoctorId] = useState('');
  const [walkInServiceId, setWalkInServiceId] = useState('');
  const [walkInNotes, setWalkInNotes] = useState('');

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const doctors = mockStore.getDoctors();
  const services = mockStore.getServices();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = mockStore.getAppointments({ date: todayStr });

  // Group queue
  const waitingPatients = todaysAppointments.filter((a) => a.status === 'Checked-in');
  const inConsultation = todaysAppointments.filter((a) => a.status === 'In-consultation');
  const pendingApprovals = todaysAppointments.filter((a) => a.status === 'Pending');
  const confirmedPatients = todaysAppointments.filter((a) => a.status === 'Confirmed');

  const handleCheckIn = (aptId: string) => {
    mockStore.updateAppointmentStatus(aptId, 'Checked-in');
  };

  const handleApprove = (aptId: string) => {
    mockStore.updateAppointmentStatus(aptId, 'Confirmed');
  };

  const handleMarkNoShow = (aptId: string) => {
    if (window.confirm('Mark this patient as No-show?')) {
      mockStore.updateAppointmentStatus(aptId, 'No-show');
    }
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName || !walkInPhone || !walkInDoctorId || !walkInServiceId) return;

    const currentTime = new Date().toTimeString().substring(0, 5);

    mockStore.createAppointment({
      branchId: clinic.branches[0]?.id || 'branch-indiranagar',
      patientId: 'usr-walkin-' + Date.now().toString(36),
      patientName: walkInName,
      patientPhone: walkInPhone,
      forWhom: 'Self (Walk-in)',
      doctorId: walkInDoctorId,
      serviceId: walkInServiceId,
      date: todayStr,
      time: currentTime,
      source: 'walk-in',
      patientNotes: walkInNotes,
    });

    setIsWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    setWalkInNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded">
              Front Desk Operations
            </span>
            <span className="text-xs text-slate-400 font-mono">Date: {todayStr}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Live Reception Queue & Today's Bookings
          </h1>
        </div>

        <Button
          onClick={() => {
            setWalkInDoctorId(doctors[0]?.id || '');
            setWalkInServiceId(services[0]?.id || '');
            setIsWalkInModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
        >
          <PlusCircle className="h-4 w-4 mr-1.5" />
          New Walk-in Patient
        </Button>
      </div>

      {/* Queue Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
            In Consultation
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{inConsultation.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
            Waiting in Lobby
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{waitingPatients.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Confirmed for Today
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{confirmedPatients.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
            Pending Approvals
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{pendingApprovals.length}</p>
        </div>
      </div>

      {/* Main Today's Appointments Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            All Consultations Scheduled for Today ({todaysAppointments.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Token</th>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Doctor & Service</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todaysAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No appointments booked for today yet.
                  </td>
                </tr>
              ) : (
                todaysAppointments.map((apt) => {
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <span className="font-black text-sm text-sky-700">
                          #{apt.tokenNumber || '-'}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{apt.time}</td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{apt.patientName}</p>
                        <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {apt.patientPhone}
                        </p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-slate-800">{apt.doctorName}</p>
                        <p className="text-[11px] text-slate-500">{apt.serviceName}</p>
                      </td>
                      <td className="p-3.5">
                        <Badge status={apt.status}>{apt.status}</Badge>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {apt.status === 'Pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(apt.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-[11px]"
                          >
                            Approve
                          </Button>
                        )}

                        {apt.status === 'Confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(apt.id)}
                            className="bg-sky-600 hover:bg-sky-700 text-[11px]"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Check-in (Arrived)
                          </Button>
                        )}

                        {['Confirmed', 'Pending'].includes(apt.status) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkNoShow(apt.id)}
                            className="text-slate-400 hover:text-rose-600 text-[11px]"
                          >
                            No-show
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Walk-in Booking Modal */}
      <Modal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        title="Register Walk-in Patient"
        description="Creates an instant confirmed booking with automatic daily queue token."
      >
        <form onSubmit={handleWalkInSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Patient Full Name *
            </label>
            <input
              required
              type="text"
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              placeholder="e.g. Meera Nambiar"
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Patient Phone *
            </label>
            <input
              required
              type="tel"
              value={walkInPhone}
              onChange={(e) => setWalkInPhone(e.target.value)}
              placeholder="+91 98450 12345"
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Consulting Doctor *
              </label>
              <select
                value={walkInDoctorId}
                onChange={(e) => setWalkInDoctorId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Service *
              </label>
              <select
                value={walkInServiceId}
                onChange={(e) => setWalkInServiceId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (₹{s.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Chief Complaint / Front-desk Notes
            </label>
            <textarea
              rows={2}
              value={walkInNotes}
              onChange={(e) => setWalkInNotes(e.target.value)}
              placeholder="e.g. Acute joint pain, walked in without appointment..."
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsWalkInModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Issue Token & Check In
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
