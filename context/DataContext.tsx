import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Equipment, MaintenanceRequest, MaintenanceTeam, TicketStatus, User, Activity } from '../types';

const API_BASE = '/api';

interface SystemOptions {
  categories: string[];
  departments: string[];
  locations: string[];
}

interface DataContextType {
  users: Record<string, User>;
  teams: MaintenanceTeam[];
  equipment: Equipment[];
  tickets: MaintenanceRequest[];
  activities: Activity[];
  options: SystemOptions;
  isLoading: boolean;
  refetch: () => Promise<void>;
  addEquipment: (equip: Omit<Equipment, 'id' | 'lastMaintenance'>) => Promise<void>;
  updateEquipment: (id: string, data: Partial<Equipment>) => Promise<void>;
  addTicket: (ticket: Omit<MaintenanceRequest, 'id' | 'dateCreated' | 'status'>) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  addTeam: (team: Omit<MaintenanceTeam, 'id'>) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'avatarUrl'>) => Promise<void>;
  addMemberToTeam: (teamId: string, userId: string) => Promise<void>;
  getEquipmentById: (id: string) => Equipment | undefined;
  addSystemOption: (type: keyof SystemOptions, value: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [tickets, setTickets] = useState<MaintenanceRequest[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [options, setOptions] = useState<SystemOptions>({
    categories: [],
    departments: [],
    locations: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, teamsRes, equipmentRes, ticketsRes, activitiesRes, optionsRes] = await Promise.all([
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/teams`),
        fetch(`${API_BASE}/equipment`),
        fetch(`${API_BASE}/tickets`),
        fetch(`${API_BASE}/activities`),
        fetch(`${API_BASE}/options`),
      ]);

      const [usersData, teamsData, equipmentData, ticketsData, activitiesData, optionsData] = await Promise.all([
        usersRes.json(),
        teamsRes.json(),
        equipmentRes.json(),
        ticketsRes.json(),
        activitiesRes.json(),
        optionsRes.json(),
      ]);

      setUsers(usersData);
      setTeams(teamsData);
      setEquipment(equipmentData);
      setTickets(ticketsData);
      setActivities(activitiesData);
      setOptions(optionsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const logActivity = async (type: Activity['type'], message: string) => {
    try {
      const res = await fetch(`${API_BASE}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, user: 'Mitchell Admin' }),
      });
      const newActivity = await res.json();
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const addEquipment = async (equipData: Omit<Equipment, 'id' | 'lastMaintenance'>) => {
    try {
      const res = await fetch(`${API_BASE}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipData),
      });
      const newEquip = await res.json();
      setEquipment(prev => [newEquip, ...prev]);
      await logActivity('equipment_added', `Added new equipment: ${newEquip.name}`);
    } catch (error) {
      console.error('Failed to add equipment:', error);
    }
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    try {
      // Merge with existing data
      const existing = equipment.find(e => e.id === id);
      if (!existing) return;

      const updated = { ...existing, ...data };
      await fetch(`${API_BASE}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setEquipment(prev => prev.map(item => item.id === id ? updated : item));
      await logActivity('equipment_updated', `Updated details for equipment: ${data.name || existing.name}`);
    } catch (error) {
      console.error('Failed to update equipment:', error);
    }
  };

  const addTicket = async (ticketData: Omit<MaintenanceRequest, 'id' | 'dateCreated' | 'status'>) => {
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      const newTicket = await res.json();
      setTickets(prev => [newTicket, ...prev]);
      await logActivity('ticket_created', `Created maintenance ticket for ${newTicket.equipmentName}`);
    } catch (error) {
      console.error('Failed to add ticket:', error);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: TicketStatus) => {
    try {
      await fetch(`${API_BASE}/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const ticket = tickets.find(t => t.id === ticketId);

      // Update local state
      if (status === 'scrap' && ticket) {
        setEquipment(prev => prev.map(e =>
          e.id === ticket.equipmentId ? { ...e, status: 'down' } : e
        ));
      }

      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
      await logActivity('ticket_status_change', `Updated ticket #${ticketId} status to ${status}`);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const addTeam = async (teamData: Omit<MaintenanceTeam, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData),
      });
      const newTeam = await res.json();
      setTeams(prev => [...prev, newTeam]);
      await logActivity('team_created', `Created new team: ${newTeam.name}`);
    } catch (error) {
      console.error('Failed to add team:', error);
    }
  };

  const addUser = async (userData: Omit<User, 'id' | 'avatarUrl'>) => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const newUser = await res.json();
      setUsers(prev => ({ ...prev, [newUser.id]: newUser }));
      await logActivity('user_invited', `Invited new technician: ${newUser.name}`);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const addMemberToTeam = async (teamId: string, userId: string) => {
    try {
      await fetch(`${API_BASE}/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      setTeams(prev => prev.map(team => {
        if (team.id === teamId && !team.memberIds.includes(userId)) {
          return { ...team, memberIds: [...team.memberIds, userId] };
        }
        return team;
      }));
    } catch (error) {
      console.error('Failed to add member to team:', error);
    }
  };

  const addSystemOption = async (type: keyof SystemOptions, value: string) => {
    try {
      await fetch(`${API_BASE}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value }),
      });
      setOptions(prev => {
        if (prev[type].includes(value)) return prev;
        return { ...prev, [type]: [...prev[type], value] };
      });
    } catch (error) {
      console.error('Failed to add system option:', error);
    }
  };

  const getEquipmentById = (id: string) => equipment.find(e => e.id === id);

  return (
    <DataContext.Provider value={{
      users,
      teams,
      equipment,
      tickets,
      activities,
      options,
      isLoading,
      refetch: fetchData,
      addEquipment,
      updateEquipment,
      addTicket,
      updateTicketStatus,
      addTeam,
      addUser,
      addMemberToTeam,
      getEquipmentById,
      addSystemOption
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};