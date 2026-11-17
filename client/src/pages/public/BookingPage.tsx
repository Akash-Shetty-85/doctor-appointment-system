import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { mockStore } from '../../lib/mockStore';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Building2,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TimeSlot } from '../../types';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const doctors = mockStore.getDoctors();
  const services = mockStore.getServices();
  const activeUser = mockStore.getActiveUser();

  // URL query pre-fills
  const preSelectedDoctorId = searchParams.get('doctorId') || '';
  const preSelectedServiceId = searchParams.get('serviceId') || '';

  // Form State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBranchId, setSelectedBranchId] = useState(clinic.branches[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(preSelectedServiceId || services[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(preSelectedDoctorId || doctors[0]?.id || '');

  // Date selection (defaults to today)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Slot Lock State (5-minute countdown)
  const [isSlotLocked, setIsSlotLocked] = useState(false);
  const [lockTimeLeftSeconds, setLockTimeLeftSeconds] = useState(300); // 5 mins

  // Patient Info
  const [forWhom, setForWhom] = useState<'Self' | string>('Self');
  const [patientName, setPatientName] = useState(activeUser.name || '');
  const [patientPhone, setPatientPhone] = useState(activeUser.phone || '');
  const [patientNotes, setPatientNotes] = useState('');

  // Confirmed booking result
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Available slots for selected doctor + date
  const availableSlots: TimeSlot[] = selectedDoctorId && selectedDate
    ? mockStore.getAvailableSlots(selectedDoctorId, selectedDate, selectedServiceId)
    : [];

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedBranch = clinic.branches.find((b) => b.id === selectedBranchId);

  // Handle countdown for locked slot
  useEffect(() => {
    let interval: any = null;
    if (isSlotLocked && lockTimeLeftSeconds > 0) {
      interval = setInterval(() => {
        setLockTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            setIsSlotLocked(false);
            setSelectedTimeSlot('');
            alert('Your 5-minute slot reservation has expired. Please pick a slot again.');
            setCurrentStep(2);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSlotLocked, lockTimeLeftSeconds]);

  // Lock slot handler
  const handleSelectSlot = (slotTime: string) => {
    setSelectedTimeSlot(slotTime);
    const locked = mockStore.lockSlot(selectedDoctorId, selectedDate, slotTime);
    if (locked) {
      setIsSlotLocked(true);
      setLockTimeLeftSeconds(300);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Final Confirmation
  const handleConfirmBooking = () => {
    if (!selectedTimeSlot) return;

    const apt = mockStore.createAppointment({
      branchId: selectedBranchId,
      patientId: activeUser.id,
      patientName: patientName || activeUser.name,
      patientPhone: patientPhone || activeUser.phone,
      forWhom: forWhom,
      doctorId: selectedDoctorId,
      serviceId: selectedServiceId,
      date: selectedDate,
      time: selectedTimeSlot,
      source: 'online',
      patientNotes: patientNotes,
    });

    setBookingResult(apt);
    setCurrentStep(4);
    setIsSlotLocked(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Wizard Step Bar */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-6">
          Book an Appointment at {clinic.name}
        </h1>

        <div className="flex items-center justify-between relative max-w-xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 w-full -z-0" />
          {[
            { step: 1, label: 'Service & Doctor' },
            { step: 2, label: 'Date & Slot' },
            { step: 3, label: 'Patient Details' },
            { step: 4, label: 'Confirmed' },
          ].map((item) => {
            const isCompleted = currentStep > item.step || (currentStep === 4 && item.step === 4);
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="flex flex-col items-center relative z-10 bg-slate-50 px-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : item.step}
                </div>
                <span className="text-[11px] font-semibold text-slate-600 mt-1 hidden sm:block">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Branch, Service & Doctor Selection */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-sky-600" />
            <span>Select Location, Department & Doctor</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Hospital Branch
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              >
                {clinic.branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} - {b.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Service / Treatment
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  // Find doctors who offer this service or department
                  const s = services.find((item) => item.id === e.target.value);
                  const matchingDoc = doctors.find((d) => d.departmentId === s?.departmentId);
                  if (matchingDoc) setSelectedDoctorId(matchingDoc.id);
                }}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (₹{s.price} • {s.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctor Selection Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Choose Specialist
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                      <p className="text-[11px] text-sky-700 font-medium truncate">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-500 mt-1">₹{doc.consultationFee} fee</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedDoctorId || !selectedServiceId}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <span>Continue to Date & Slot</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Date & Slot Selection */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-sky-600" />
              <span>Select Date & Time Slot</span>
            </h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Change Doctor / Service
            </button>
          </div>

          {/* Doctor Brief Header */}
          <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/80">
            <div className="flex items-center gap-3">
              <img
                src={selectedDoctor?.photoUrl}
                alt={selectedDoctor?.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedDoctor?.name}</p>
                <p className="text-xs text-slate-500">
                  {selectedService?.name} • ₹{selectedDoctor?.consultationFee}
                </p>
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Appointment Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTimeSlot('');
                setIsSlotLocked(false);
              }}
              className="w-full sm:w-64 rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
            />
          </div>

          {/* Slots Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Available Time Slots
              </label>
              {isSlotLocked && (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>Slot Held: {formatTimer(lockTimeLeftSeconds)}</span>
                </div>
              )}
            </div>

            {availableSlots.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
                Doctor is not available or has no open slots on this date. Please pick another date.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.time;
                  return (
                    <button
                      key={slot.time}
                      disabled={!slot.available && !isSelected}
                      onClick={() => handleSelectSlot(slot.time)}
                      className={`p-2.5 rounded-lg text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-300 shadow-sm'
                          : slot.available
                          ? 'bg-white hover:bg-sky-50 hover:border-sky-300 text-slate-800 border-slate-200 cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedTimeSlot}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <span>Continue to Patient Details</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Patient Info & Summary */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-sky-600" />
              <span>Confirm Patient & Medical Notes</span>
            </h2>
            {isSlotLocked && (
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span>Slot Reserved: {formatTimer(lockTimeLeftSeconds)}</span>
              </div>
            )}
          </div>

          {/* Booking Summary Box */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-900">{selectedDoctor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-semibold text-slate-800">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Slot:</span>
              <span className="font-bold text-sky-700">{selectedDate} at {selectedTimeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consultation Fee:</span>
              <span className="font-bold text-slate-900">₹{selectedDoctor?.consultationFee} (Pay at clinic)</span>
            </div>
          </div>

          {/* Family Member or Self */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Appointment is For:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setForWhom('Self');
                  setPatientName(activeUser.name);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  forWhom === 'Self'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Self ({activeUser.name})
              </button>
              {activeUser.familyMembers?.map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => {
                    setForWhom(`${fam.fullName} (${fam.relationship})`);
                    setPatientName(fam.fullName);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    forWhom.includes(fam.fullName)
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {fam.fullName} ({fam.relationship})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Patient Full Name *
              </label>
              <input
                required
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone *
              </label>
              <input
                required
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Medical Concerns / Chief Complaints (Optional)
            </label>
            <textarea
              rows={2}
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="e.g. Mild headache, chest pain or past prescription renewal..."
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={!patientName || !patientPhone}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Confirm Appointment Booking
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Success Confirmation */}
      {currentStep === 4 && bookingResult && (
        <Card className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-9 w-9" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Booking Confirmed
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Your Appointment is Scheduled!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              SMS and WhatsApp confirmation sent to {bookingResult.patientPhone}.
            </p>
          </div>

          {/* Token Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Queue Token</span>
                <p className="text-2xl font-black text-sky-600">#{bookingResult.tokenNumber}</p>
              </div>
              <Badge status={bookingResult.status}>{bookingResult.status}</Badge>
            </div>

            <div className="text-xs space-y-1.5 text-slate-600">
              <p>
                <strong className="text-slate-800">Doctor:</strong> {bookingResult.doctorName}
              </p>
              <p>
                <strong className="text-slate-800">Date & Slot:</strong> {bookingResult.date} at {bookingResult.time}
              </p>
              <p>
                <strong className="text-slate-800">Patient:</strong> {bookingResult.patientName} ({bookingResult.forWhom})
              </p>
              <p>
                <strong className="text-slate-800">Hospital:</strong> {clinic.name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link to="/patient/dashboard">
              <Button className="bg-sky-600 hover:bg-sky-700">
                View in Patient Portal
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setBookingResult(null);
                setCurrentStep(1);
                setSelectedTimeSlot('');
              }}
            >
              Book Another Appointment
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
