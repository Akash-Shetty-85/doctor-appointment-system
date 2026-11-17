import React, { useState, useEffect } from 'react';
import { mockStore } from '../../lib/mockStore';
import { Users, UserPlus, Trash2, Heart, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { FamilyMember } from '../../types';

export const PatientFamilyPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('Spouse');
  const [gender, setGender] = useState<FamilyMember['gender']>('Female');
  const [dob, setDob] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');

  useEffect(() => {
    return mockStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeUser = mockStore.getActiveUser();
  const familyMembers = activeUser.familyMembers || [];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dob) return;

    const newMember: FamilyMember = {
      id: 'fam-' + Date.now().toString(36),
      fullName,
      relationship,
      gender,
      dob,
      bloodGroup,
    };

    activeUser.familyMembers = [...familyMembers, newMember];
    mockStore.resetToDefault; // trigger re-render / mock persist
    setIsAddModalOpen(false);
    setFullName('');
    setDob('');
  };

  const handleRemoveMember = (id: string) => {
    if (window.confirm('Remove this family member?')) {
      activeUser.familyMembers = familyMembers.filter((m) => m.id !== id);
      setTick((t) => t + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Family Members
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add your children, spouse, or elderly parents to easily book appointments on their behalf.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-sky-600 hover:bg-sky-700">
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add Family Member
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current User Card */}
        <Card className="p-6 border-l-4 border-l-sky-600 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
            Primary Account Holder
          </span>
          <h3 className="font-bold text-slate-900 text-base">{activeUser.name}</h3>
          <p className="text-xs text-slate-500">{activeUser.phone}</p>
          <div className="text-xs text-slate-600 pt-2 border-t border-slate-100">
            <p>DOB: {activeUser.dob || '1989-06-14'}</p>
            <p>Gender: {activeUser.gender || 'Male'}</p>
          </div>
        </Card>

        {/* Family Member Cards */}
        {familyMembers.map((fam) => (
          <Card key={fam.id} className="p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {fam.relationship}
                </span>
                <button
                  onClick={() => handleRemoveMember(fam.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{fam.fullName}</h3>
              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <p>Gender: {fam.gender}</p>
                <p>DOB: {fam.dob}</p>
                {fam.bloodGroup && <p>Blood Group: <strong className="text-slate-800">{fam.bloodGroup}</strong></p>}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Linked for Booking
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Family Member"
        description="Linked members can be selected during appointment checkout."
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ananya Verma"
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date of Birth *
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
              Save Family Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
