export type Language = 'fr' | 'en';

export type InterventionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type InterventionType = 'rodent' | 'disinfection' | 'insect';

export interface User {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'technician';
  avatar?: string;
  language: Language;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  specialties: InterventionType[];
  availability: 'available' | 'busy' | 'off-duty';
  createdAt: string;
}

export interface Intervention {
  id: string;
  type: InterventionType;
  status: InterventionStatus;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number; // hours
  address: string;
  clientId: string;
  clientName: string;
  technicianId?: string;
  technicianName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  scheduledInterventions: number;
  completedInterventions: number;
  pendingInterventions: number;
  activeClients: number;
  totalTechnicians: number;
  satisfactionRate: number;
}

export interface ActivityItem {
  id: string;
  type: 'intervention' | 'client' | 'report';
  action: string;
  description: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface MonthlyStats {
  month: string;
  interventions: number;
  clients: number;
  revenue: number;
}

export interface Translations {
  nav: Record<string, string>;
  landing: Record<string, string>;
  auth: Record<string, string>;
  dashboard: Record<string, string>;
  clients: Record<string, string>;
  interventions: Record<string, string>;
  technicians: Record<string, string>;
  calendar: Record<string, string>;
  reports: Record<string, string>;
  profile: Record<string, string>;
  common: Record<string, string>;
}
