import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Shield, Wrench, User as UserIcon, Clock, Activity, Briefcase, AlertTriangle, CheckCircle2, XCircle, Edit } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Equipment, EquipmentStatus, User } from '../types';

export const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEquipmentById, tickets, teams, updateEquipment, options, users } = useData();
  const historyRef = useRef<HTMLDivElement>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Equipment>>({});

  const asset = getEquipmentById(id || '');
  
  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-bold text-gray-900">Asset Not Found</h2>
        <Button onClick={() => navigate('/equipment')} className="mt-4 w-auto">Back to Equipment</Button>
      </div>
    );
  }

  const appUsers = Object.values(users) as User[];
  const assignedTeam = teams.find(t => t.id === asset.maintenanceTeamId);
  const defaultTech = asset.technicianId ? appUsers.find(u => u.id === asset.technicianId) : null;
  const assetTickets = tickets.filter(t => t.equipmentId === asset.id);
  const technicians = appUsers.filter(u => u.role === 'technician' || u.role === 'admin');
  
  // Calculate Open Requests for Smart Button Badge
  const openTicketCount = assetTickets.filter(t => t.status === 'new' || t.status === 'in-progress').length;

  const scrollToHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditClick = () => {
    setEditFormData({
      name: asset.name,
      serialNumber: asset.serialNumber,
      location: asset.location,
      category: asset.category,
      department: asset.department,
      maintenanceTeamId: asset.maintenanceTeamId,
      technicianId: asset.technicianId || '',
      purchaseDate: asset.purchaseDate,
      warrantyExpiration: asset.warrantyExpiration,
      assignedTo: asset.assignedTo || '',
      status: asset.status,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEquipment(asset.id, editFormData);
    setIsEditModalOpen(false);
  };

  // Status Badge Configuration
  const statusConfig = {
    operational: { 
      styles: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle2 
    },
    maintenance: { 
      styles: 'bg-amber-100 text-amber-800 border-amber-200', 
      icon: AlertTriangle 
    },
    down: { 
      styles: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle 
    },
  };

  const statusInfo = statusConfig[asset.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Smart Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/equipment')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
               <span className="font-mono bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-600 text-xs">{asset.serialNumber}</span>
               
               {/* Enhanced Status Badge */}
               <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.styles}`}>
                 <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                 {asset.status.toUpperCase()}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="w-auto h-[52px]" onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          {/* Odoo-like Smart Button - Enhanced Visibility */}
          <button
            type="button"
            onClick={scrollToHistory}
            className="flex items-center bg-white border-2 border-brand-100 rounded-lg shadow-sm px-5 py-3 hover:border-brand-300 hover:bg-brand-50 transition-all group active:scale-95"
            title="Click to view Maintenance Requests"
          >
            <div className="p-2 bg-brand-100 rounded-lg mr-4 group-hover:bg-brand-200 transition-colors">
              <Wrench className="h-6 w-6 text-brand-700" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-extrabold text-brand-900 leading-none">{openTicketCount}</span>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mt-1">Maintenance</span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-brand-600" />
                Technical Specification
              </h3>
              <span className="text-xs text-gray-500">Last Updated: {asset.lastMaintenance}</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {asset.location}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                    {asset.category}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Department</label>
                  <div className="mt-1 text-gray-900 font-medium bg-gray-50 inline-block px-2 py-1 rounded">
                    {asset.department}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                 <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {asset.purchaseDate}
                  </div>
                </div>
                 <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty Expiration</label>
                  <div className="mt-1 flex items-center text-gray-900">
                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                    {asset.warrantyExpiration}
                  </div>
                </div>
                {asset.assignedTo && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Employee</label>
                    <div className="mt-1 flex items-center text-gray-900">
                      <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {asset.assignedTo}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Maintenance History */}
          <div ref={historyRef} className="bg-white rounded-xl border border-gray-200 shadow-sm scroll-mt-6">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-brand-600" />
                Maintenance History
              </h3>
              <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{assetTickets.length}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {assetTickets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No maintenance records found.</div>
              ) : (
                assetTickets.map(ticket => (
                  <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          ticket.type === 'corrective' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>{ticket.type}</span>
                        <h4 className="text-sm font-medium text-gray-900">{ticket.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-400 space-x-3">
                        <span>Created: {ticket.dateCreated}</span>
                        {ticket.scheduledDate && <span>Scheduled: {ticket.scheduledDate}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        ticket.status === 'repaired' ? 'bg-green-100 text-green-700' : 
                        ticket.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 
                        ticket.status === 'scrap' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ticket.status.replace('-', ' ').toUpperCase()}
                      </span>
                      {ticket.assignee && (
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <img src={ticket.assignee.avatarUrl} className="h-4 w-4 rounded-full mr-1" alt="" />
                          {ticket.assignee.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Team & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Responsible Team</h3>
            <div className="flex items-start space-x-3">
              <div className="bg-brand-100 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{assignedTeam?.name || 'Unassigned'}</h4>
                <p className="text-xs text-gray-500 mt-1">{assignedTeam?.description}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 mb-3">KEY CONTACTS</h4>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Default Tech</span>
                    {defaultTech ? (
                      <div className="flex items-center">
                        <img src={defaultTech.avatarUrl} className="w-5 h-5 rounded-full mr-2" alt=""/>
                        <span className="font-medium text-gray-900">{defaultTech.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Support</span>
                    <span className="text-brand-600 hover:underline cursor-pointer">Contact IT</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Fixed Contrast Issues */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
            <p className="text-brand-100 text-sm mb-6">Need to report an issue with this specific asset?</p>
            
            <div className="space-y-3">
              <button 
                type="button"
                className="w-full flex items-center justify-center bg-white text-brand-600 hover:bg-brand-50 font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Breakdown
              </button>
              
              <button
                type="button"
                className="w-full flex items-center justify-center bg-transparent border-2 border-brand-200 text-white hover:bg-white/10 font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Equipment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Equipment Details"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <Input 
            label="Asset Name" 
            value={editFormData.name || ''}
            onChange={e => setEditFormData({...editFormData, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Serial Number" 
              value={editFormData.serialNumber || ''}
              onChange={e => setEditFormData({...editFormData, serialNumber: e.target.value})}
              required
            />
            <Select 
              label="Category" 
              value={editFormData.category || ''}
              onChange={e => setEditFormData({...editFormData, category: e.target.value})}
              options={[
                { value: '', label: 'Select Category...' },
                ...options.categories.map(c => ({ value: c, label: c }))
              ]}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <Select 
              label="Department" 
              value={editFormData.department || ''}
              onChange={e => setEditFormData({...editFormData, department: e.target.value})}
              options={[
                { value: '', label: 'Select Department...' },
                ...options.departments.map(d => ({ value: d, label: d }))
              ]}
              required
            />
            <Select 
              label="Location" 
              value={editFormData.location || ''}
              onChange={e => setEditFormData({...editFormData, location: e.target.value})}
              options={[
                { value: '', label: 'Select Location...' },
                ...options.locations.map(l => ({ value: l, label: l }))
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Select 
              label="Assigned Team"
              value={editFormData.maintenanceTeamId || ''}
              onChange={e => setEditFormData({...editFormData, maintenanceTeamId: e.target.value})}
              options={[
                { value: '', label: 'Select Team...' },
                ...teams.map(t => ({ value: t.id, label: t.name }))
              ]}
              required
            />
             <Select 
              label="Default Technician"
              value={editFormData.technicianId || ''}
              onChange={e => setEditFormData({...editFormData, technicianId: e.target.value})}
              options={[
                { value: '', label: 'Assign Default Technician...' },
                ...technicians.map(t => ({ value: t.id, label: t.name }))
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="date"
              label="Purchase Date" 
              value={editFormData.purchaseDate || ''}
              onChange={e => setEditFormData({...editFormData, purchaseDate: e.target.value})}
              required
            />
            <Input 
              type="date"
              label="Warranty Expiration" 
              value={editFormData.warrantyExpiration || ''}
              onChange={e => setEditFormData({...editFormData, warrantyExpiration: e.target.value})}
              required
            />
          </div>

          <Input 
            label="Assigned Employee (Optional)" 
            value={editFormData.assignedTo || ''}
            onChange={e => setEditFormData({...editFormData, assignedTo: e.target.value})}
            placeholder="e.g. John Doe"
          />

          <div className="pt-4 flex space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};