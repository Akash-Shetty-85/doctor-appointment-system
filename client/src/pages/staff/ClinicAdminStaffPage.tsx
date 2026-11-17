import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Users, UserPlus, Shield, Phone, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const ClinicAdminStaffPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const users = mockStore.getClinics(); // we can list staff users
  const activeClinic = mockStore.getActiveClinic();

  const staffMembers = [
    { name: 'Dr. Vikram Seth', role: 'CLINIC_ADMIN', email: 'admin@apexhealthcare.com', phone: '+91 98765 00003', status: 'Active' },
    { name: 'Dr. Arvind Rao', role: 'DOCTOR', email: 'arvind.rao@apexhealthcare.com', phone: '+91 98765 00001', status: 'Active' },
    { name: 'Dr. Priya Sharma', role: 'DOCTOR', email: 'priya.sharma@apexhealthcare.com', phone: '+91 98765 00004', status: 'Active' },
    { name: 'Sunita Menon', role: 'RECEPTIONIST', email: 'reception@apexhealthcare.com', phone: '+91 98765 00002', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Clinic Staff & Role Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage authorized staff accounts, role permissions (Admin, Doctor, Receptionist), and branch assignments.
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Active Staff Directory ({staffMembers.length} Accounts)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Staff Member</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Contact Email & Phone</th>
                <th className="p-3.5">Scope</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((staff, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-slate-900">{staff.name}</td>
                  <td className="p-3.5">
                    <Badge variant="purple">{staff.role.replace('_', ' ')}</Badge>
                  </td>
                  <td className="p-3.5 text-slate-600 font-mono">
                    <p>{staff.email}</p>
                    <p className="text-[11px] text-slate-400">{staff.phone}</p>
                  </td>
                  <td className="p-3.5 text-slate-500">{activeClinic.branches[0]?.name}</td>
                  <td className="p-3.5">
                    <Badge variant="success">{staff.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
