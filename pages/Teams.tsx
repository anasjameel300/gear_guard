import React, { useState } from 'react';
import { Users, UserPlus, Wrench, Plus, Briefcase, Mail, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { useData } from '../context/DataContext';
import { User, MaintenanceTeam } from '../types';

export const Teams: React.FC = () => {
  const { teams, users, addTeam, addUser, addMemberToTeam } = useData();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [manageTeamId, setManageTeamId] = useState<string | null>(null);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'technician' as const, department: '' });

  // Team Form State
  const [teamForm, setTeamForm] = useState({ name: '', description: '' });

  // Manage Team State
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(inviteForm);
    setIsInviteModalOpen(false);
    setInviteForm({ name: '', email: '', role: 'technician', department: '' });
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTeam({ ...teamForm, memberIds: [], leadTechnicianId: '' });
    setIsTeamModalOpen(false);
    setTeamForm({ name: '', description: '' });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (manageTeamId && selectedUserId) {
      addMemberToTeam(manageTeamId, selectedUserId);
      setSelectedUserId('');
    }
  };

  const activeTeam = teams.find(t => t.id === manageTeamId);
  const availableUsers = (Object.values(users) as User[]).filter(u => 
    activeTeam ? !activeTeam.memberIds.includes(u.id) : true
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Teams</h1>
          <p className="text-gray-500 mt-1">Manage specialized technical teams and assignments</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsTeamModalOpen(true)}>
             <Plus className="h-4 w-4 mr-2" />
             Create Team
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Technician
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div key={team.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-brand-50 to-white">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-white rounded-lg border border-brand-100 shadow-sm">
                   <Wrench className="h-6 w-6 text-brand-600" />
                </div>
                <span className="text-xs font-bold bg-white text-gray-600 px-2 py-1 rounded border border-gray-200">
                  {team.memberIds.length} Members
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{team.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{team.description}</p>
            </div>
            
            <div className="p-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Team Members</h4>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
                {team.memberIds.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No members assigned.</p>
                ) : (
                    team.memberIds.map(memberId => {
                    const user = (Object.values(users) as User[]).find(u => u.id === memberId);
                    if (!user) return null;
                    const isLead = team.leadTechnicianId === user.id;

                    return (
                        <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full bg-gray-100" />
                            <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                        </div>
                        {isLead && (
                            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                            LEAD
                            </span>
                        )}
                        </div>
                    );
                    })
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
               <Button variant="outline" className="w-full text-xs h-8" onClick={() => setManageTeamId(team.id)}>
                 Manage Team
               </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Technician Modal */}
      <Modal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        title="Invite New Technician"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
           <Input 
             label="Full Name" 
             value={inviteForm.name} 
             onChange={e => setInviteForm({...inviteForm, name: e.target.value})} 
             icon={<Briefcase className="h-4 w-4" />}
             required 
           />
           <Input 
             label="Email Address" 
             type="email"
             value={inviteForm.email} 
             onChange={e => setInviteForm({...inviteForm, email: e.target.value})} 
             icon={<Mail className="h-4 w-4" />}
             required 
           />
           <div className="grid grid-cols-2 gap-4">
             <Select 
                label="Role"
                value={inviteForm.role}
                onChange={e => setInviteForm({...inviteForm, role: e.target.value as any})}
                options={[
                    { value: 'technician', label: 'Technician' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'admin', label: 'Admin' },
                ]}
             />
             <Input 
                label="Department" 
                value={inviteForm.department} 
                onChange={e => setInviteForm({...inviteForm, department: e.target.value})} 
                placeholder="e.g. Maintenance"
             />
           </div>
           <Button type="submit" className="mt-4">Send Invitation</Button>
        </form>
      </Modal>

      {/* Create Team Modal */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title="Create Maintenance Team"
      >
         <form onSubmit={handleTeamSubmit} className="space-y-4">
            <Input 
                label="Team Name"
                placeholder="e.g. Rapid Response Unit"
                value={teamForm.name}
                onChange={e => setTeamForm({...teamForm, name: e.target.value})}
                required
            />
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    rows={3}
                    value={teamForm.description}
                    onChange={e => setTeamForm({...teamForm, description: e.target.value})}
                    placeholder="Describe the team's responsibilities..."
                />
            </div>
            <Button type="submit" className="mt-4">Create Team</Button>
         </form>
      </Modal>

      {/* Manage Team Modal */}
      <Modal
         isOpen={!!manageTeamId}
         onClose={() => setManageTeamId(null)}
         title={`Manage ${activeTeam?.name}`}
      >
        <div className="space-y-6">
           <form onSubmit={handleAddMember} className="flex gap-2 items-end">
              <div className="flex-1">
                 <Select 
                    label="Add Team Member"
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    options={[
                        { value: '', label: 'Select a user...' },
                        ...availableUsers.map(u => ({ value: u.id, label: `${u.name} (${u.role})` }))
                    ]}
                 />
              </div>
              <Button type="submit" className="w-auto mb-0.5" disabled={!selectedUserId}>Add</Button>
           </form>

           <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Members</h4>
              <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-100 max-h-60 overflow-y-auto">
                 {activeTeam?.memberIds.map(memberId => {
                    const user = (Object.values(users) as User[]).find(u => u.id === memberId);
                    if(!user) return null;
                    return (
                        <div key={user.id} className="p-3 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <img src={user.avatarUrl} className="h-8 w-8 rounded-full" alt="" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            {/* Removal functionality could be added here later */}
                        </div>
                    )
                 })}
                 {activeTeam?.memberIds.length === 0 && (
                     <div className="p-4 text-center text-sm text-gray-500">No members in this team yet.</div>
                 )}
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
};