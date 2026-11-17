import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStore } from '../../lib/mockStore';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  Stethoscope,
  Star,
  Users,
  Award,
  ArrowRight,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const HomePage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const doctors = mockStore.getDoctors().slice(0, 4);
  const services = mockStore.getServices().slice(0, 6);
  const testimonials = mockStore.getTestimonials().slice(0, 3);
  const faqs = mockStore.getFAQs().slice(0, 4);

  // Enquiry quick form state
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryDept, setEnquiryDept] = useState(clinic.departments[0]?.name || '');
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;

    mockStore.submitEnquiry({
      clinicId: clinic.id,
      name: enquiryName,
      phone: enquiryPhone,
      preferredDepartment: enquiryDept,
      message: enquiryMsg || 'General consultation enquiry',
    });

    setEnquirySuccess(true);
    setEnquiryName('');
    setEnquiryPhone('');
    setEnquiryMsg('');
    setTimeout(() => setEnquirySuccess(false), 5000);
  };

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold">
              <Sparkles className="h-4 w-4 text-sky-600" />
              <span>Multi-Speciality Healthcare Excellence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Compassionate Care for You and Your Family at{' '}
              <span className="text-sky-600">{clinic.name}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              {clinic.branding.tagline}. Discover certified specialists, verify live available slots,
              and receive instant booking confirmations with digital queue tokens.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/book">
                <Button size="lg" className="bg-sky-600 hover:bg-sky-700 shadow-md">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment Now
                </Button>
              </Link>
              <Link to="/doctors">
                <Button variant="outline" size="lg">
                  Meet Our Doctors
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-slate-700">Verified Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-500 shrink-0" />
                <span className="text-xs font-medium text-slate-700">Zero Wait Time Slots</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500 shrink-0" />
                <span className="text-xs font-medium text-slate-700">Digital Health Records</span>
              </div>
            </div>
          </div>

          {/* Quick Enquiry Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-bl-full -z-0 opacity-50" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Request an Appointment Enquiry
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Our front-desk team will call you back within 15 minutes during operating hours.
                </p>

                {enquirySuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>Enquiry submitted successfully! Our reception will reach out to you shortly.</span>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        required
                        type="tel"
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Department
                      </label>
                      <select
                        value={enquiryDept}
                        onChange={(e) => setEnquiryDept(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      >
                        {clinic.departments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Symptoms / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={enquiryMsg}
                        onChange={(e) => setEnquiryMsg(e.target.value)}
                        placeholder="Briefly describe your medical concern or questions..."
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
                      Submit Enquiry
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
                Our Specialists
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                Meet Leading Medical Doctors
              </h2>
            </div>
            <Link
              to="/doctors"
              className="mt-3 md:mt-0 text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>View All Doctors ({mockStore.getDoctors().length})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <Card key={doc.id} className="flex flex-col justify-between overflow-hidden group">
                <div className="space-y-3">
                  <div className="aspect-4/3 w-full rounded-lg overflow-hidden bg-slate-200">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <Badge variant="info" className="mb-1 text-[10px]">
                      {doc.specialization}
                    </Badge>
                    <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{doc.qualifications}</p>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      <span>{doc.experienceYears} Years Clinical Experience</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Consultation</span>
                    <span className="font-bold text-slate-900 text-sm">₹{doc.consultationFee}</span>
                  </div>
                  <Link to={`/book?doctorId=${doc.id}`}>
                    <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-xs">
                      Book Slot
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Treatments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
            Clinical Departments
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Treatments & Diagnostics
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Equipped with modern diagnostic tools and advanced surgical facilities for comprehensive patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <Card key={srv.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-sky-500" />
                    <span>{srv.durationMinutes} mins</span>
                  </span>
                  <span className="text-sm font-bold text-slate-900">₹{srv.price}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link to={`/book?serviceId=${srv.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300">
                    Book Service
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sky-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-widest">
              Patient Stories
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              Trusted by Over 10,000 Patients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-sky-800/60 rounded-xl p-6 border border-sky-700/60 flex flex-col justify-between backdrop-blur-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-sky-100 italic leading-relaxed">"{t.comment}"</p>
                </div>
                <div className="pt-4 mt-4 border-t border-sky-700/60">
                  <p className="font-bold text-sm text-white">{t.patientName}</p>
                  <p className="text-[11px] text-sky-300">{t.treatmentName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-2">{faq.question}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
