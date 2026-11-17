import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import {
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const ClinicAdminDashboardPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const clinic = mockStore.getActiveClinic();
  const appointments = mockStore.getAppointments();
  const doctors = mockStore.getDoctors();
  const enquiries = mockStore.getEnquiries();

  const totalApts = appointments.length;
  const completedApts = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledApts = appointments.filter((a) => a.status === 'Cancelled').length;
  const noShows = appointments.filter((a) => a.status === 'No-show').length;
  const convertedEnquiries = enquiries.filter((e) => e.status === 'Converted').length;

  const noShowRate = totalApts > 0 ? ((noShows / totalApts) * 100).toFixed(1) : '0';
  const conversionRate = enquiries.length > 0 ? ((convertedEnquiries / enquiries.length) * 100).toFixed(1) : '0';

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Patient,Doctor,Service,Date,Time,Status,Token\n' +
      appointments
        .map(
          (a) =>
            `${a.id},"${a.patientName}","${a.doctorName}","${a.serviceName}",${a.date},${a.time},${a.status},${a.tokenNumber || ''}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${clinic.subdomain}-appointments-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded">
              Management Dashboard
            </span>
            <span className="text-xs text-slate-500 font-mono">Tenant ID: {clinic.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {clinic.name} — Performance Analytics
          </h1>
        </div>

        <Button onClick={handleExportCSV} variant="outline" className="text-xs">
          <Download className="h-4 w-4 mr-1.5" />
          Export Appointments (CSV)
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
          <p className="text-2xl font-black text-slate-900">{totalApts}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +18% this month
          </span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Completed Visits</span>
          <p className="text-2xl font-black text-emerald-700">{completedApts}</p>
          <span className="text-[11px] text-slate-400">Consultations done</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-500 font-medium">No-Show Rate</span>
          <p className="text-2xl font-black text-amber-700">{noShowRate}%</p>
          <span className="text-[11px] text-slate-400">Target &lt; 5%</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Enquiry Conversion</span>
          <p className="text-2xl font-black text-purple-700">{conversionRate}%</p>
          <span className="text-[11px] text-slate-400">{convertedEnquiries} converted leads</span>
        </Card>
      </div>

      {/* Doctors Utilization Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Doctor Utilization & Caseload ({doctors.length} Doctors)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Doctor</th>
                <th className="p-3.5">Specialization</th>
                <th className="p-3.5">Consultation Fee</th>
                <th className="p-3.5">Working Hours</th>
                <th className="p-3.5">Bookings</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((doc) => {
                const docApts = appointments.filter((a) => a.doctorId === doc.id);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{doc.name}</td>
                    <td className="p-3.5 text-slate-600">{doc.specialization}</td>
                    <td className="p-3.5 font-semibold text-slate-800">₹{doc.consultationFee}</td>
                    <td className="p-3.5 text-slate-500">
                      {doc.workingHours.start} - {doc.workingHours.end}
                    </td>
                    <td className="p-3.5 font-bold text-sky-700">{docApts.length}</td>
                    <td className="p-3.5">
                      <Badge variant="success">Active</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
