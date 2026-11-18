import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { ShieldCheck, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const PatientConsentsPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [commConsent, setCommConsent] = useState(true);
  const [dataConsent, setDataConsent] = useState(true);
  const [erasureRequested, setErasureRequested] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeUser = mockStore.getActiveUser();
  if (!activeUser) return null;

  const handleSaveConsents = () => {
    activeUser.consents = {
      communication: commConsent,
      dataProcessing: dataConsent,
      timestamp: new Date().toISOString(),
    };
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleErasureRequest = () => {
    if (
      window.confirm(
        'Under the Digital Personal Data Protection (DPDP) Act 2023, this will register a verified request to anonymize your personal records after statutory medical retention periods expire. Proceed?'
      )
    ) {
      setErasureRequested(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Privacy, DPDP & Consent Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage how your contact information and electronic health data are processed in compliance with the Digital Personal Data Protection Act 2023.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Your privacy preferences have been updated and timestamped.</span>
        </div>
      )}

      {/* Consent Toggles */}
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Communication & Automated Reminders
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Receive booking confirmations, queue token notifications, prescription alerts, and visit reminders via SMS, WhatsApp, and email.
              </p>
            </div>
            <input
              type="checkbox"
              checked={commConsent}
              onChange={(e) => setCommConsent(e.target.checked)}
              className="h-5 w-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer mt-1"
            />
          </div>

          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Clinical Health Records Processing
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Permit authorized consulting doctors and clinical staff within the clinic to access your medical history, vitals, allergies, and prior prescriptions during active visits.
              </p>
            </div>
            <input
              type="checkbox"
              checked={dataConsent}
              onChange={(e) => setDataConsent(e.target.checked)}
              className="h-5 w-5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveConsents} className="bg-sky-600 hover:bg-sky-700">
            Save Consent Preferences
          </Button>
        </div>
      </Card>

      {/* DPDP Data Erasure */}
      <Card className="p-6 border-rose-200 bg-rose-50/30 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-rose-900 text-sm">Right to Erasure (DPDP Act 2023)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have the right to request erasure of your personal data when it is no longer necessary for the medical purpose for which it was collected. Note that certain statutory clinical records must be retained for clinical liability periods as mandated by law.
            </p>
          </div>
        </div>

        {erasureRequested ? (
          <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-lg text-rose-900 text-xs font-semibold">
            Erasure Request #DPDP-8921 recorded. Our Data Protection Officer (DPO) will process this within 72 hours.
          </div>
        ) : (
          <div className="pt-2 flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={handleErasureRequest}
              className="text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Submit Data Erasure Request
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
