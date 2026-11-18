import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import {
  FileText,
  Printer,
  Calendar,
  Stethoscope,
  Pill,
  Download,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Consultation, Doctor } from '../../types';

export const PatientPrescriptionsPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeUser = mockStore.getActiveUser();
  if (!activeUser) return null;

  const clinic = mockStore.getActiveClinic();
  const consultations = mockStore.getConsultationsByPatient(activeUser.id);
  const doctors = mockStore.getDoctors();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Prescriptions & Medical Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your signed digital prescriptions, clinical diagnosis, and dosage instructions.
          </p>
        </div>
      </div>

      {consultations.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 space-y-2">
          <FileText className="h-10 w-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No prescriptions found</p>
          <p className="text-xs text-slate-400">
            Completed consultations with doctor prescriptions will automatically appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {consultations.map((cns) => {
            const doc = doctors.find((d) => d.id === cns.doctorId);
            return (
              <Card key={cns.id} className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                      {cns.date}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Rx Ref: {cns.id}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{doc?.name || 'Consulting Physician'}</h3>
                    <p className="text-xs text-slate-500">{doc?.specialization}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 border border-slate-100">
                    <p>
                      <strong className="text-slate-800">Diagnosis:</strong> {cns.diagnosis}
                    </p>
                    <p className="text-slate-600">
                      <strong className="text-slate-800">Medications:</strong> {cns.prescriptions.length} items prescribed
                    </p>
                    {cns.followUpDate && (
                      <p className="text-emerald-700 font-medium">
                        Next Follow-up: {cns.followUpDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Digitally Verified</span>
                  <Button
                    size="sm"
                    onClick={() => setSelectedConsultation(cns)}
                    className="bg-sky-600 hover:bg-sky-700 text-xs"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View & Print Prescription
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Branded Prescription Modal */}
      {selectedConsultation && (
        <Modal
          isOpen={!!selectedConsultation}
          onClose={() => setSelectedConsultation(null)}
          title="Digital Prescription"
          maxWidth="2xl"
        >
          <div className="space-y-6 printable-rx font-sans">
            {/* Prescription Header */}
            <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {clinic.name}
                </h2>
                <p className="text-xs text-slate-500">{clinic.branding.tagline}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{clinic.branding.address}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Ph: {clinic.branding.phone} • Reg No: {clinic.registrationNo}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-black text-sky-700">℞</span>
                <p className="text-[10px] text-slate-400 font-mono">Rx ID: {selectedConsultation.id}</p>
                <p className="text-xs font-bold text-slate-800">Date: {selectedConsultation.date}</p>
              </div>
            </div>

            {/* Doctor & Patient Info Bar */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg text-xs border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">
                  {doctors.find((d) => d.id === selectedConsultation.doctorId)?.name}
                </p>
                <p className="text-slate-600">
                  {doctors.find((d) => d.id === selectedConsultation.doctorId)?.qualifications}
                </p>
                <p className="text-[11px] text-sky-700 font-semibold">
                  {doctors.find((d) => d.id === selectedConsultation.doctorId)?.specialization}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">Patient: {activeUser.name}</p>
                <p className="text-slate-600">Phone: {activeUser.phone}</p>
                {activeUser.allergies && activeUser.allergies.length > 0 && (
                  <p className="text-rose-600 font-semibold text-[11px]">
                    Known Allergies: {activeUser.allergies.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Clinical Observations */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Symptoms & Clinical Diagnosis
              </h4>
              <p className="text-slate-600 bg-white p-2.5 rounded border border-slate-100">
                <strong className="text-slate-800">Diagnosis: </strong>
                {selectedConsultation.diagnosis}
              </p>
              {selectedConsultation.symptoms && (
                <p className="text-slate-500 text-[11px] italic">
                  Symptoms: {selectedConsultation.symptoms}
                </p>
              )}
            </div>

            {/* Rx Medications Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Pill className="h-3.5 w-3.5 text-sky-600" />
                <span>Prescribed Medications</span>
              </h4>
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Medicine Name</th>
                    <th className="p-2.5">Dosage</th>
                    <th className="p-2.5">Frequency</th>
                    <th className="p-2.5">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedConsultation.prescriptions.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        {med.medicineName}
                        {med.notes && (
                          <span className="block text-[10px] text-slate-500 font-normal">
                            Note: {med.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-700">{med.dosage}</td>
                      <td className="p-2.5 text-slate-700">{med.frequency}</td>
                      <td className="p-2.5 text-slate-700 font-medium">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Advice & Follow-up */}
            <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
              <p className="text-slate-700">
                <strong className="text-slate-900">Clinical Advice:</strong>{' '}
                {selectedConsultation.clinicalNotes}
              </p>
              {selectedConsultation.followUpDate && (
                <p className="text-sky-700 font-bold">
                  Recommended Follow-up Visit: {selectedConsultation.followUpDate}
                </p>
              )}
            </div>

            {/* Signature Area */}
            <div className="pt-6 flex justify-between items-end border-t border-slate-200">
              <span className="text-[10px] text-slate-400">
                Generated via MediBook EHR • Digitally Signed & Encrypted
              </span>
              <div className="text-right">
                <div className="h-8 w-24 border-b border-slate-400 mb-1 ml-auto" />
                <p className="text-xs font-bold text-slate-900">
                  {doctors.find((d) => d.id === selectedConsultation.doctorId)?.name}
                </p>
                <p className="text-[10px] text-slate-500">Authorized Physician Signature</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 no-print">
              <Button variant="outline" onClick={() => setSelectedConsultation(null)}>
                Close
              </Button>
              <Button onClick={handlePrint} className="bg-sky-600 hover:bg-sky-700">
                <Printer className="h-4 w-4 mr-1.5" />
                Print / Save PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
