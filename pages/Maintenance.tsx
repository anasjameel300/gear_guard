import React, { useState } from 'react';
import { Wrench, Plus, Calendar as CalendarIcon, AlertCircle, Clock, CheckCircle2, MoreHorizontal, Layout, Trash2, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { MaintenanceRequest, Priority, TicketStatus, RequestType } from '../types';
import { useData } from '../context/DataContext';

// --- Sub-Components ---

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const TicketCard: React.FC<{ ticket: MaintenanceRequest; onDragStart: (e: React.DragEvent, id: string) => void }> = ({ ticket, onDragStart }) => {
  const isOverdue = ticket.scheduledDate && new Date(ticket.scheduledDate) < new Date() && ticket.status !== 'repaired' && ticket.status !== 'scrap';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, ticket.id)}
      className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all cursor-move group active:cursor-grabbing relative overflow-hidden ${isOverdue ? 'border-l-4 border-l-red-500 border-t-gray-200 border-r-gray-200 border-b-gray-200' : 'border-gray-200'}`}
    >
      {isOverdue && (
        <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-bl">
          OVERDUE
        </div>
      )}

      <div className="flex justify-between items-start mb-2 mt-1">
        <PriorityBadge priority={ticket.priority} />
        <div className="flex items-center space-x-1">
          {ticket.type === 'preventive' && (
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Prev</span>
          )}
          <span className="text-xs text-gray-400 font-mono">#{ticket.id}</span>
        </div>
      </div>

      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
        {ticket.title}
      </h4>
      <p className="text-sm text-gray-500 mb-3 flex items-center">
        <Wrench className="h-3 w-3 mr-1" />
        {ticket.equipmentName}
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex flex-col text-xs text-gray-400">
          <div className={`flex items-center ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            <CalendarIcon className="h-3 w-3 mr-1" />
            {ticket.scheduledDate || ticket.dateCreated}
          </div>
        </div>
        {ticket.assignee ? (
          <img
            src={ticket.assignee.avatarUrl}
            alt={ticket.assignee.name}
            title={`Assigned to ${ticket.assignee.name}`}
            className="h-7 w-7 rounded-full border-2 border-white shadow-sm"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center border border-dashed border-gray-300" title="Unassigned">
            <span className="text-[10px] text-gray-400">?</span>
          </div>
        )}
      </div>
    </div>
  );
}

const KanbanColumn: React.FC<{
  title: string;
  status: TicketStatus;
  tickets: MaintenanceRequest[];
  icon: React.ReactNode;
  colorClass: string;
  onDrop: (e: React.DragEvent, status: TicketStatus) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}> = ({ title, status, tickets, icon, colorClass, onDrop, onDragStart }) => {
  const columnTickets = tickets.filter(t => t.status === status);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, status)}
      className="flex flex-col h-full bg-gray-100/50 rounded-xl overflow-hidden border border-gray-200"
    >
      {/* Column Header */}
      <div className={`p-4 border-b border-gray-200 ${colorClass} flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
        <span className="bg-white/50 text-gray-700 text-xs px-2.5 py-1 rounded-full font-bold">
          {columnTickets.length}
        </span>
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[500px]">
        {columnTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-300/50 rounded-lg">
            <p className="text-sm">No tickets</p>
          </div>
        ) : (
          columnTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} onDragStart={onDragStart} />
          ))
        )}
      </div>
    </div>
  );
};

// --- Calendar Component ---
const CalendarView: React.FC<{
  tickets: MaintenanceRequest[],
  onDateClick: (date: string) => void
}> = ({ tickets, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="bg-gray-50/50 h-32 border-b border-r border-gray-200" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Show ALL tickets scheduled for this date - handle both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss" formats
    const dayTickets = tickets.filter(t => t.scheduledDate && t.scheduledDate.startsWith(dateStr));

    // Helper to get ticket color based on type and priority
    const getTicketStyle = (ticket: MaintenanceRequest) => {
      if (ticket.status === 'completed') {
        return 'bg-green-50 text-green-700 border-green-100';
      }
      if (ticket.priority === 'high') {
        return 'bg-red-50 text-red-700 border-red-100';
      }
      if (ticket.type === 'preventive') {
        return 'bg-purple-50 text-purple-700 border-purple-100';
      }
      return 'bg-blue-50 text-blue-700 border-blue-100';
    };

    days.push(
      <div
        key={day}
        onClick={() => onDateClick(dateStr)}
        className="bg-white h-32 border-b border-r border-gray-200 p-2 hover:bg-brand-50 cursor-pointer transition-colors relative group"
      >
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium ${new Date().toDateString() === new Date(year, month, day).toDateString()
            ? 'bg-brand-600 text-white w-6 h-6 flex items-center justify-center rounded-full'
            : dayTickets.length > 0 ? 'text-brand-700 font-bold' : 'text-gray-700'
            }`}>{day}</span>
          {dayTickets.length > 0 && (
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 rounded-full">
              {dayTickets.length}
            </span>
          )}
          <Plus className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100" />
        </div>

        <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
          {dayTickets.slice(0, 3).map(t => (
            <div key={t.id} className={`text-[10px] p-1 rounded border truncate ${getTicketStyle(t)}`}>
              {t.title}
            </div>
          ))}
          {dayTickets.length > 3 && (
            <div className="text-[10px] text-gray-500 font-medium">
              +{dayTickets.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-auto px-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="w-auto text-xs">Today</Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-auto px-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Legend */}
      <div className="px-4 py-2 border-b border-gray-100 flex flex-wrap gap-3 text-[10px]">
        <span className="flex items-center"><span className="w-3 h-3 rounded bg-red-100 border border-red-200 mr-1"></span> High Priority</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-200 mr-1"></span> Preventive</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-200 mr-1"></span> Corrective</span>
        <span className="flex items-center"><span className="w-3 h-3 rounded bg-green-100 border border-green-200 mr-1"></span> Completed</span>
      </div>
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 bg-gray-200 gap-px border-l border-t border-gray-200">
        {days}
      </div>
    </div>
  );
}

// --- Report/Analysis Component ---
const AnalysisView: React.FC<{ tickets: MaintenanceRequest[], equipment: any[], teams: any[] }> = ({ tickets, equipment, teams }) => {
  // Aggregate by Team
  const ticketsByTeam = teams.map(team => {
    // Find equipment managed by this team
    const teamEquipIds = equipment.filter(e => e.maintenanceTeamId === team.id).map(e => e.id);
    // Count tickets for that equipment
    const count = tickets.filter(t => teamEquipIds.includes(t.equipmentId)).length;
    return { name: team.name, count };
  }).sort((a, b) => b.count - a.count);

  // Aggregate by Category
  const categoryCounts: Record<string, number> = {};
  tickets.forEach(t => {
    const equip = equipment.find(e => e.id === t.equipmentId);
    if (equip) {
      categoryCounts[equip.category] = (categoryCounts[equip.category] || 0) + 1;
    }
  });

  const maxTeamCount = Math.max(...ticketsByTeam.map(t => t.count), 1);
  const maxCatCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-brand-600" />
          Requests by Team
        </h3>
        <div className="space-y-4">
          {ticketsByTeam.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="text-gray-500">{item.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(item.count / maxTeamCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
          Requests by Equipment Category
        </h3>
        <div className="space-y-4">
          {Object.entries(categoryCounts).map(([cat, count], idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{cat}</span>
                <span className="text-gray-500">{count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxCatCount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Main Maintenance Page ---

export const Maintenance: React.FC = () => {
  const { tickets, equipment, teams, addTicket, updateTicketStatus } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'calendar' | 'report'>('kanban');

  // Drag and Drop State
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('ticketId', id);
  };

  const handleDrop = (e: React.DragEvent, status: TicketStatus) => {
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      updateTicketStatus(ticketId, status);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    equipmentId: '',
    priority: 'medium' as Priority,
    description: '',
    type: 'corrective' as RequestType,
    scheduledDate: '',
  });

  const handleCreateClick = (date?: string) => {
    if (date) {
      setFormData(prev => ({ ...prev, scheduledDate: date, type: 'preventive' }));
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEquipment = equipment.find(e => e.id === formData.equipmentId);

    addTicket({
      ...formData,
      equipmentName: selectedEquipment?.name || 'Unknown',
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      equipmentId: '',
      priority: 'medium',
      description: '',
      type: 'corrective',
      scheduledDate: '',
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-500 mt-1">Manage, schedule, and analyze maintenance tasks</p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* View Toggle */}
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-brand-50 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Kanban Board"
            >
              <Layout className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-brand-50 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Calendar"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('report')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'report' ? 'bg-brand-50 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Reports"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>

          <Button className="w-full sm:w-auto" onClick={() => handleCreateClick()}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
            <KanbanColumn
              title="New"
              status="new"
              tickets={tickets}
              icon={<AlertCircle className="h-4 w-4 text-blue-600" />}
              colorClass="bg-blue-50/50"
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
            <KanbanColumn
              title="In Progress"
              status="in-progress"
              tickets={tickets}
              icon={<Clock className="h-4 w-4 text-amber-600" />}
              colorClass="bg-amber-50/50"
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
            <KanbanColumn
              title="Repaired"
              status="repaired"
              tickets={tickets}
              icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
              colorClass="bg-green-50/50"
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
            <KanbanColumn
              title="Scrap"
              status="scrap"
              tickets={tickets}
              icon={<Trash2 className="h-4 w-4 text-gray-600" />}
              colorClass="bg-gray-100"
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="h-full overflow-y-auto">
            <CalendarView tickets={tickets} onDateClick={handleCreateClick} />
          </div>
        )}

        {viewMode === 'report' && (
          <div className="h-full overflow-y-auto">
            <AnalysisView tickets={tickets} equipment={equipment} teams={teams} />
          </div>
        )}
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Maintenance Request"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject / Issue Title"
            placeholder="e.g. Strange noise from motor"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Request Type"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as RequestType })}
              options={[
                { value: 'corrective', label: 'Corrective (Breakdown)' },
                { value: 'preventive', label: 'Preventive (Planned)' },
              ]}
            />
            <Input
              type="date"
              label="Scheduled Date"
              value={formData.scheduledDate}
              onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Equipment"
              value={formData.equipmentId}
              onChange={e => setFormData({ ...formData, equipmentId: e.target.value })}
              options={[
                { value: '', label: 'Select Equipment...' },
                ...equipment.map(e => ({ value: e.id, label: e.name }))
              ]}
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
              options={[
                { value: 'low', label: 'Low - Routine' },
                { value: 'medium', label: 'Medium - Affects Efficiency' },
                { value: 'high', label: 'High - Critical Failure' },
              ]}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              rows={4}
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 flex space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};