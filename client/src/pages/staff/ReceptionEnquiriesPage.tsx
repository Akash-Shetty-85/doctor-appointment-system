import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import {
  Inbox,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Enquiry, EnquiryStatus } from '../../types';

export const ReceptionEnquiriesPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [staffNotes, setStaffNotes] = useState('');
  const [enqStatus, setEnqStatus] = useState<EnquiryStatus>('New');

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const enquiries = mockStore.getEnquiries();
  const doctors = mockStore.getDoctors();
  const services = mockStore.getServices();
  const clinic = mockStore.getActiveClinic();

  const filteredEnquiries = enquiries.filter(
    (e) => filterStatus === 'all' || e.status === filterStatus
  );

  const openEditModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setStaffNotes(enq.notes || '');
    setEnqStatus(enq.status);
  };

  const handleSaveNotes = () => {
    if (!selectedEnquiry) return;
    mockStore.updateEnquiry(selectedEnquiry.id, {
      status: enqStatus,
      notes: staffNotes,
      assignedToStaffName: 'Sunita Menon (Reception)',
    });
    setSelectedEnquiry(null);
  };

  const handleConvert = (enq: Enquiry) => {
    const doc = doctors[0];
    const srv = services[0];
    const todayStr = new Date().toISOString().split('T')[0];

    const apt = mockStore.createAppointment({
      branchId: clinic.branches[0]?.id || 'branch-indiranagar',
      patientId: 'usr-lead-' + enq.id,
      patientName: enq.name,
      patientPhone: enq.phone,
      patientEmail: enq.email,
      forWhom: 'Self',
      doctorId: doc.id,
      serviceId: srv.id,
      date: enq.preferredDate || todayStr,
      time: '11:30',
      source: 'phone',
      patientNotes: `Converted from Lead: ${enq.message}`,
    });

    mockStore.updateEnquiry(enq.id, {
      status: 'Converted',
      notes: `Converted to Appointment #${apt.tokenNumber || apt.id}`,
    });

    alert(`Enquiry converted successfully! Created appointment for ${enq.name}.`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Enquiry Leads & Patient Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track inquiries submitted via the public clinic website, assign staff notes, and convert leads into booked appointments.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {['all', 'New', 'Contacted', 'Converted', 'Closed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === s
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEnquiries.length === 0 ? (
          <Card className="p-12 text-center text-slate-400">
            <Inbox className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No enquiries in this status</p>
          </Card>
        ) : (
          filteredEnquiries.map((enq) => (
            <Card key={enq.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <Badge status={enq.status}>{enq.status}</Badge>
                  <h3 className="font-bold text-slate-900 text-base">{enq.name}</h3>
                  {enq.preferredDepartment && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                      Dept: {enq.preferredDepartment}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">Received: {enq.createdAt.split('T')[0]}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Phone className="h-3.5 w-3.5 text-sky-600" />
                    <span>{enq.phone}</span>
                  </p>
                  {enq.email && (
                    <p className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="h-3.5 w-3.5 text-purple-600" />
                      <span>{enq.email}</span>
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                    Patient Query:
                  </span>
                  <p className="text-slate-700 italic">"{enq.message}"</p>
                </div>
              </div>

              {enq.notes && (
                <div className="text-xs text-slate-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                  <strong className="text-amber-900">Front-desk Note:</strong> {enq.notes}
                  {enq.assignedToStaffName && (
                    <span className="text-[10px] text-amber-700 ml-2 font-mono">
                      — {enq.assignedToStaffName}
                    </span>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(enq)}
                  className="text-xs"
                >
                  Update Notes & Status
                </Button>

                {enq.status !== 'Converted' && (
                  <Button
                    size="sm"
                    onClick={() => handleConvert(enq)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Convert to Appointment
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Edit Enquiry Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title="Update Enquiry Follow-up"
          description={`Lead from ${selectedEnquiry.name} (${selectedEnquiry.phone})`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={enqStatus}
                onChange={(e) => setEnqStatus(e.target.value as EnquiryStatus)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Staff Follow-up Notes
              </label>
              <textarea
                rows={3}
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="e.g. Spoke to patient on WhatsApp, confirmed appointment date..."
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" onClick={() => setSelectedEnquiry(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotes} className="bg-sky-600 hover:bg-sky-700">
                Save Updates
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
