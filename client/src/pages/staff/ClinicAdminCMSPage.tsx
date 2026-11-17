import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Palette, CheckCircle2, Globe, Phone, MessageCircle, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const ClinicAdminCMSPage: React.FC = () => {
  const [, setTick] = useState(0);
  const clinic = mockStore.getActiveClinic();
  const branding = clinic.branding;

  const [clinicName, setClinicName] = useState(branding.clinicName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [phone, setPhone] = useState(branding.phone);
  const [emergencyPhone, setEmergencyPhone] = useState(branding.emergencyPhone || '');
  const [email, setEmail] = useState(branding.email);
  const [address, setAddress] = useState(branding.address);
  const [whatsappNumber, setWhatsappNumber] = useState(branding.whatsappNumber);
  const [whatsappMsg, setWhatsappMsg] = useState(branding.whatsappPrefilledMessage);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateClinicBranding(clinic.id, {
      clinicName,
      tagline,
      phone,
      emergencyPhone,
      email,
      address,
      whatsappNumber,
      whatsappPrefilledMessage: whatsappMsg,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Clinic Branding & Website CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize the public website copy, emergency numbers, and WhatsApp integration in real time.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Branding and website content saved! Changes are live on your public site.</span>
        </div>
      )}

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              General Clinic Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Clinic / Hospital Name *
                </label>
                <input
                  required
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tagline / Motto *
                </label>
                <input
                  required
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Physical Address *
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Communication & WhatsApp Integration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  General Phone *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Emergency 24x7 Phone
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 text-rose-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp Default Prefilled Message
                </label>
                <input
                  type="text"
                  value={whatsappMsg}
                  onChange={(e) => setWhatsappMsg(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
              <Save className="h-4 w-4 mr-1.5" />
              Publish CMS Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
