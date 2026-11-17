import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const ContactPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const branding = clinic.branding;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.submitEnquiry({
      clinicId: clinic.id,
      name,
      phone,
      email,
      preferredDepartment: dept || clinic.departments[0]?.name,
      message: msg,
    });
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMsg('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Contact {clinic.name}
        </h1>
        <p className="text-sm text-slate-600">
          We are here to assist with hospital visits, directions, reports, and second opinions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & Branches */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
              Primary Contacts
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Phone</p>
                  <p>{branding.phone}</p>
                </div>
              </div>

              {branding.emergencyPhone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-rose-700">24x7 Emergency Line</p>
                    <p className="text-rose-600 font-bold">{branding.emergencyPhone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Email</p>
                  <p>{branding.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Consultation Timings</p>
                  <p>Mon - Sat: {clinic.settings.workingHours.open} - {clinic.settings.workingHours.close}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Hospital Branches */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Our Branches</h3>
            {clinic.branches.map((b) => (
              <Card key={b.id} className="p-4 space-y-1 text-xs">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-sky-600" />
                  {b.name} {b.isMain && <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">Main</span>}
                </p>
                <p className="text-slate-600">{b.address}, {b.city}</p>
                <p className="text-slate-500 font-medium">{b.phone}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Enquiry / Contact Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8">
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              Send an Online Enquiry
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out your details and our front-desk coordinators will call you back directly.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Thank You for Reaching Out!</h4>
                <p className="text-xs text-emerald-700">
                  Your enquiry has been logged into our reception system. A representative will contact you shortly.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anand Murthy"
                      className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Department of Interest
                    </label>
                    <select
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                    >
                      {clinic.departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Message / Medical Query *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Describe your health concern, symptoms or questions..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  Submit Enquiry
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
