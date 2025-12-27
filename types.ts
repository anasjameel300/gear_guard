export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'manager';
  avatarUrl?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type EquipmentStatus = 'operational' | 'maintenance' | 'down';

export interface MaintenanceTeam {
  id: string;
  name: string; // e.g., Mechanics, Electricians, IT
  description: string;
  leadTechnicianId: string;
  memberIds: string[];
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  location: string;
  status: EquipmentStatus;
  lastMaintenance: string;
  category: string;
  image?: string;

  // New Fields per requirements
  department: string; // e.g., Production, Office
  assignedTo?: string; // Employee Name (if personal asset like Laptop)
  maintenanceTeamId: string; // The team responsible
  technicianId?: string; // Specific default technician
  purchaseDate: string;
  warrantyExpiration: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type TicketStatus = 'new' | 'in-progress' | 'on-hold' | 'completed' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';

export interface MaintenanceRequest {
  id: string;
  title: string;
  equipmentId: string; // Linked by ID now
  equipmentName: string; // Kept for display convenience
  priority: Priority;
  status: TicketStatus;
  assignee?: User;
  dateCreated: string;
  description: string;

  // New Fields
  type: RequestType;
  scheduledDate?: string;
  duration?: string; // e.g., "2 hours"
}

export interface Activity {
  id: string;
  type: 'ticket_created' | 'ticket_status_change' | 'team_created' | 'user_invited' | 'equipment_added' | 'equipment_updated';
  message: string;
  timestamp: string;
  user?: string;
}