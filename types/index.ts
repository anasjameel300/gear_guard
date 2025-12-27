// ===========================================
// GearGuard Type Definitions
// ===========================================
// These types mirror the Prisma schema but are used for frontend/API contracts

// User Types
export type UserRole = 'ADMIN' | 'TECHNICIAN' | 'MANAGER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  department?: string | null;
  createdAt: Date;
  updatedAt: Date;
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

// Equipment Types
export type EquipmentStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'DOWN';

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  status: EquipmentStatus;
  location: string;
  department: string;
  category: string;
  assignedTo?: string | null;
  imageUrl?: string | null;
  purchaseDate: Date;
  warrantyExpiration: Date;
  lastMaintenance?: Date | null;
  maintenanceTeamId?: string | null;
  technicianId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentWithRelations extends Equipment {
  maintenanceTeam?: Team | null;
  technician?: User | null;
  tickets?: MaintenanceTicket[];
}

// Team Types
export interface Team {
  id: string;
  name: string;
  description?: string | null;
  leadTechnicianId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamWithRelations extends Team {
  leadTechnician?: User | null;
  members?: TeamMember[];
  memberCount?: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  joinedAt: Date;
  user?: User;
}

// Maintenance Ticket Types
export type TicketStatus = 'NEW' | 'IN_PROGRESS' | 'REPAIRED' | 'SCRAP';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type RequestType = 'CORRECTIVE' | 'PREVENTIVE';

export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: RequestType;
  scheduledDate?: Date | null;
  duration?: string | null;
  equipmentId: string;
  assignedToId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceTicketWithRelations extends MaintenanceTicket {
  equipment?: Equipment;
  assignee?: User | null;
}

// Activity Log Types
export type ActivityType =
  | 'TICKET_CREATED'
  | 'TICKET_STATUS_CHANGE'
  | 'TEAM_CREATED'
  | 'USER_INVITED'
  | 'EQUIPMENT_ADDED'
  | 'EQUIPMENT_UPDATED';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: Date;
  entityType?: string | null;
  entityId?: string | null;
  userId?: string | null;
  user?: User | null;
}

// System Options
export interface SystemOption {
  id: string;
  type: 'category' | 'department' | 'location';
  value: string;
  createdAt: Date;
}

export interface SystemOptions {
  categories: string[];
  departments: string[];
  locations: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalEquipment: number;
  totalTickets: number;
  activeTickets: number;
  criticalIssues: number;
  completedThisMonth: number;
}

// Form Types
export interface CreateEquipmentInput {
  name: string;
  serialNumber: string;
  location: string;
  department: string;
  category: string;
  assignedTo?: string;
  maintenanceTeamId?: string;
  technicianId?: string;
  purchaseDate: string;
  warrantyExpiration: string;
}

export interface UpdateEquipmentInput extends Partial<CreateEquipmentInput> {
  status?: EquipmentStatus;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  type: RequestType;
  equipmentId: string;
  scheduledDate?: string;
  assignedToId?: string;
}

export interface UpdateTicketInput extends Partial<CreateTicketInput> {
  status?: TicketStatus;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
  leadTechnicianId?: string;
}

export interface InviteUserInput {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}



