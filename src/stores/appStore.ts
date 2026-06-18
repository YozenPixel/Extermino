import { create } from 'zustand';
import type { Client, Intervention, Technician, DashboardStats, ActivityItem, Notification } from '../types';
import {
  mockClients, mockInterventions, mockTechnicians,
  mockDashboardStats, mockActivities, mockNotifications,
} from './mockData';

// --- Client Store ---
interface ClientStore {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: mockClients,
  addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),
  updateClient: (id, data) => set((s) => ({
    clients: s.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
  })),
  deleteClient: (id) => set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),
  getClient: (id) => get().clients.find((c) => c.id === id),
}));

// --- Intervention Store ---
interface InterventionStore {
  interventions: Intervention[];
  addIntervention: (intervention: Intervention) => void;
  updateIntervention: (id: string, data: Partial<Intervention>) => void;
  deleteIntervention: (id: string) => void;
  getIntervention: (id: string) => Intervention | undefined;
}

export const useInterventionStore = create<InterventionStore>((set, get) => ({
  interventions: mockInterventions,
  addIntervention: (intervention) => set((s) => ({ interventions: [...s.interventions, intervention] })),
  updateIntervention: (id, data) => set((s) => ({
    interventions: s.interventions.map((i) => (i.id === id ? { ...i, ...data } : i)),
  })),
  deleteIntervention: (id) => set((s) => ({ interventions: s.interventions.filter((i) => i.id !== id) })),
  getIntervention: (id) => get().interventions.find((i) => i.id === id),
}));

// --- Technician Store ---
interface TechnicianStore {
  technicians: Technician[];
  addTechnician: (tech: Technician) => void;
  updateTechnician: (id: string, data: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
  getTechnician: (id: string) => Technician | undefined;
}

export const useTechnicianStore = create<TechnicianStore>((set, get) => ({
  technicians: mockTechnicians,
  addTechnician: (tech) => set((s) => ({ technicians: [...s.technicians, tech] })),
  updateTechnician: (id, data) => set((s) => ({
    technicians: s.technicians.map((t) => (t.id === id ? { ...t, ...data } : t)),
  })),
  deleteTechnician: (id) => set((s) => ({ technicians: s.technicians.filter((t) => t.id !== id) })),
  getTechnician: (id) => get().technicians.find((t) => t.id === id),
}));

// --- Dashboard Store ---
interface DashboardStore {
  stats: DashboardStats;
  activities: ActivityItem[];
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: mockDashboardStats,
  activities: mockActivities,
  notifications: mockNotifications,
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  })),
}));
