import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import {
  Stethoscope,
  Clock,
  User,
  CheckCircle,
  FileText,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Pill,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Appointment, PrescriptionItem } from '../../types';

export const DoctorQueuePage: React.FC = () => {
  const [, setTick] = useState(0);

  // Active consultation modal
  const [activeConsultationApt, setActiveConsultationApt] = useState<Appointment | null>(null);

  // Consultation form fields
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { medicineName: 'Tab. Paracetamol 650mg', dosage: '1 tablet', frequency: '1-0-1 (After Food)', duration: '3 Days' },
  ]);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeDoctor = mockStore.getDoctors()[0]; // Dr. Arvind Rao
  const todayStr = new Date().toISOString().split('T')[0];

  const todaysAppointments = mockStore.getAppointments({
    doctorId: activeDoctor?.id,
    date: todayStr,
  });

  const inConsultation = todaysAppointments.find((a) => a.status === 'In-consultation');
  const waitingPatients = todaysAppointments.filter((a) => a.status === 'Checked-in');
  const completedToday = todaysAppointments.filter((a) => a.status === 'Completed');
  const upcomingConfirmed = todaysAppointments.filter((a) => a.status === 'Confirmed');

  const handleStartConsultation = (apt: Appointment) => {
    mockStore.updateAppointmentStatus(apt.id, 'In-consultation');
    openConsultationModal(apt);
  };

  const openConsultationModal = (apt: Appointment) => {
    setActiveConsultationApt(apt);
    setSymptoms(apt.patientNotes || '');
    setDiagnosis('');
    setClinicalNotes('Patient advised adequate hydration, rest, and low sodium diet.');
    setFollowUpDate('');
    setPrescriptions([
      { medicineName: 'Tab. Telmisartan 40mg', dosage: '1 tab', frequency: '1-0-0 (Morning)', duration: '30 Days', notes: 'After breakfast' },
    ]);
  };

  const handleAddMedicine = () => {
    setPrescriptions((prev) => [
      ...prev,
      { medicineName: '', dosage: '1 tablet', frequency: '1-0-1 (After Food)', duration: '5 Days' },
    ]);
  };

  const handleRemoveMedicine = (idx: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePrescriptionChange = (idx: number, field: keyof PrescriptionItem, val: string) => {
    setPrescriptions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConsultationApt || !diagnosis) return;

    mockStore.saveConsultation({
      appointmentId: activeConsultationApt.id,
      patientId: activeConsultationApt.patientId,
      doctorId: activeDoctor.id,
      clinicId: activeConsultationApt.clinicId,
      date: todayStr,
      symptoms,
      diagnosis,
      clinicalNotes,
      prescriptions: prescriptions.filter((p) => p.medicineName.trim().length > 0),
      followUpDate: followUpDate || undefined,
    });

    setActiveConsultationApt(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={activeDoctor?.photoUrl}
            alt={activeDoctor?.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded">
                Doctor Consultation Workspace
              </span>
              <span className="text-xs text-slate-400 font-mono">Date: {todayStr}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {activeDoctor?.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {activeDoctor?.specialization} • {activeDoctor?.qualifications}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" className="text-xs py-1 px-3">
            Today's Patients: {todaysAppointments.length}
          </Badge>
        </div>
      </div>

      {/* Active Consultation Highlight (if in progress) */}
      {inConsultation && (
        <Card className="p-6 border-2 border-purple-400 bg-purple-50/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <Stethoscope className="h-4 w-4" />
              Active Consultation In Progress
            </span>
            <span className="text-xl font-black text-purple-900">
              Token #{inConsultation.tokenNumber}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{inConsultation.patientName}</h3>
              <p className="text-xs text-slate-600">
                Service: <strong>{inConsultation.serviceName}</strong> • Slot: {inConsultation.time}
              </p>
              {inConsultation.patientNotes && (
                <p className="text-xs text-slate-500 mt-1 italic">
                  Patient Complaint: "{inConsultation.patientNotes}"
                </p>
              )}
            </div>

            <Button
              onClick={() => openConsultationModal(inConsultation)}
              className="bg-purple-600 hover:bg-purple-700 shadow-sm"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Open Rx & Consultation Form
            </Button>
          </div>
        </Card>
      )}

      {/* Queue Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waiting in Clinic (Checked-in) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Waiting in Lobby ({waitingPatients.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Tokens Ready</span>
          </div>

          {waitingPatients.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No patients currently in waiting room.</p>
          ) : (
            <div className="space-y-3">
              {waitingPatients.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-base text-sky-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      #{apt.tokenNumber}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{apt.patientName}</p>
                      <p className="text-[11px] text-slate-500">{apt.time} • {apt.serviceName}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleStartConsultation(apt)}
                    className="bg-sky-600 hover:bg-sky-700 text-xs"
                  >
                    Call Next Patient
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Completed Consultations Today */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Completed Consultations ({completedToday.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Today</span>
          </div>

          {completedToday.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No completed consultations yet today.</p>
          ) : (
            <div className="space-y-3">
              {completedToday.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">
                      #{apt.tokenNumber} {apt.patientName}
                    </span>
                    <p className="text-[11px] text-slate-500">{apt.serviceName}</p>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Consultation Modal */}
      {activeConsultationApt && (
        <Modal
          isOpen={!!activeConsultationApt}
          onClose={() => setActiveConsultationApt(null)}
          title={`Clinical Consultation — Token #${activeConsultationApt.tokenNumber}`}
          description={`Patient: ${activeConsultationApt.patientName} | Phone: ${activeConsultationApt.patientPhone}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveConsultation} className="space-y-5">
            {/* Symptoms and Diagnosis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Presenting Symptoms
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Fever, persistent dry cough for 3 days..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Clinical Diagnosis *
                </label>
                <textarea
                  required
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Viral Bronchitis / Stage 1 Hypertension..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            {/* Interactive Prescription Medications */}
            <div className="space-y-3 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="h-4 w-4 text-sky-600" />
                  <span>Prescription Items</span>
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddMedicine}
                  className="text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Medicine
                </Button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {prescriptions.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 items-center text-xs"
                  >
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Medicine name (e.g. Tab. Paracetamol 650mg)"
                        value={item.medicineName}
                        onChange={(e) => handlePrescriptionChange(idx, 'medicineName', e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white font-medium"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={item.dosage}
                        onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Freq (1-0-1)"
                        value={item.frequency}
                        onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Duration"
                        value={item.duration}
                        onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice & Follow-up */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical Advice & Lifestyle Instructions
                </label>
                <input
                  type="text"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="e.g. Warm water gargles, low salt, repeat lipid profile..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setActiveConsultationApt(null)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-sm">
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Sign & Complete Consultation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
