import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Search, Filter, MoreVertical, CheckCircle, AlertTriangle, XCircle, ChevronRight, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { EquipmentStatus, Equipment as EquipmentType, User as AppUser } from '../types';
import { useData } from '../context/DataContext';

const StatusBadge: React.FC<{ status: EquipmentStatus }> = ({ status }) => {
  const styles = {
    operational: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    maintenance: { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertTriangle },
    down: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  };

  const style = styles[status];
  const Icon = style.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const Equipment: React.FC = () => {
  const { equipment, addEquipment, teams, options, users } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'department' | 'employee'>('none');
  
  // Filter users for technicians
  const technicians = (Object.values(users) as AppUser[]).filter(u => u.role === 'technician' || u.role === 'admin');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    location: '',
    category: '',
    status: 'operational' as EquipmentStatus,
    department: '',
    maintenanceTeamId: '',
    technicianId: '',
    assignedTo: '',
    purchaseDate: '',
    warrantyExpiration: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipment(formData);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      serialNumber: '',
      location: '',
      category: '',
      status: 'operational',
      department: '',
      maintenanceTeamId: '',
      technicianId: '',
      assignedTo: '',
      purchaseDate: '',
      warrantyExpiration: '',
    });
  };

  const filteredEquipment = equipment.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.assignedTo && e.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Grouping Logic
  const groupedData: Record<string, EquipmentType[]> = (() => {
    if (groupBy === 'department') {
      return filteredEquipment.reduce((acc, item) => {
        const key = item.department || 'Unassigned';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, EquipmentType[]>);
    } else if (groupBy === 'employee') {
      return filteredEquipment.reduce((acc, item) => {
        const key = item.assignedTo || 'General / Unassigned';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, EquipmentType[]>);
    }
    return { 'All Equipment': filteredEquipment };
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-500 mt-1">Track assets by department, employee, and technical responsibility.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 bg-gray-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name, serial, department or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Group by:</span>
            <select 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
            >
              <option value="none">None</option>
              <option value="department">Department</option>
              <option value="employee">Employee (Owner)</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {Object.entries(groupedData).map(([groupName, items]) => (
            <div key={groupName}>
              {groupBy !== 'none' && (
                <div className="px-6 py-2 bg-gray-100 font-bold text-xs text-gray-600 uppercase tracking-wider border-y border-gray-200 flex items-center">
                  {groupBy === 'employee' && <User className="h-3 w-3 mr-2" />}
                  {groupName} ({items.length})
                </div>
              )}
              <table className="min-w-full divide-y divide-gray-200">
                {groupBy === 'none' && (
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department / Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                )}
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/equipment/${item.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                            <Package className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-brand-600">{item.name}</div>
                            <div className="text-xs text-gray-400 font-mono">{item.serialNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{item.department}</div>
                        <div className="text-xs text-gray-500">
                           {item.assignedTo || 'Unassigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-brand-600">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {equipment.length === 0 && (
             <div className="px-6 py-12 text-center text-gray-500">
                No equipment found. Click "Add Equipment" to create one.
             </div>
          )}
        </div>
      </div>

      {/* Add Equipment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Equipment"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Asset Name" 
            placeholder="e.g. Hydraulic Press X1" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Serial Number" 
              placeholder="SN-12345" 
              value={formData.serialNumber}
              onChange={e => setFormData({...formData, serialNumber: e.target.value})}
              required
            />
            <Select 
              label="Category" 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              options={[
                { value: '', label: 'Select Category...' },
                ...options.categories.map(c => ({ value: c, label: c }))
              ]}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Department (Ownership)" 
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
              options={[
                { value: '', label: 'Select Department...' },
                ...options.departments.map(d => ({ value: d, label: d }))
              ]}
              required
            />
             <Select 
              label="Location" 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              options={[
                { value: '', label: 'Select Location...' },
                ...options.locations.map(l => ({ value: l, label: l }))
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Select 
              label="Maintenance Team"
              value={formData.maintenanceTeamId}
              onChange={e => setFormData({...formData, maintenanceTeamId: e.target.value})}
              options={[
                { value: '', label: 'Select Team...' },
                ...teams.map(t => ({ value: t.id, label: t.name }))
              ]}
              required
            />
             <Select 
              label="Default Technician"
              value={formData.technicianId || ''}
              onChange={e => setFormData({...formData, technicianId: e.target.value})}
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
              value={formData.purchaseDate}
              onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
              required
            />
            <Input 
              type="date"
              label="Warranty Expiration" 
              value={formData.warrantyExpiration}
              onChange={e => setFormData({...formData, warrantyExpiration: e.target.value})}
              required
            />
          </div>

          <Input 
            label="Assigned Employee (User / Owner)" 
            value={formData.assignedTo}
            onChange={e => setFormData({...formData, assignedTo: e.target.value})}
            placeholder="e.g. John Doe (Production Manager)"
          />

          <div className="pt-4 flex space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Asset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};