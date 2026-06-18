import type {
  User, Client, Technician, Intervention,
  DashboardStats, ActivityItem, Notification, MonthlyStats,
} from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Sophie Martin',
  company: 'Hygiène Pro Services',
  email: 'sophie.martin@hygienepro.fr',
  phone: '+33 6 12 34 56 78',
  role: 'admin',
  language: 'fr',
  createdAt: '2024-01-15T08:00:00Z',
};

export const mockClients: Client[] = [
  { id: '1', name: 'Jean Dupont', company: 'Boulangerie Dupont', address: '12 Rue de la Paix, 75001 Paris', phone: '+33 6 11 22 33 44', email: 'jean@dupont.fr', createdAt: '2024-06-01', updatedAt: '2024-06-01' },
  { id: '2', name: 'Marie Laurent', company: 'Restaurant Le Gourmet', address: '45 Avenue des Champs, 75008 Paris', phone: '+33 6 22 33 44 55', email: 'marie@legourmet.fr', createdAt: '2024-06-05', updatedAt: '2024-06-10' },
  { id: '3', name: 'Pierre Moreau', company: 'Hôtel Splendid', address: '78 Boulevard Haussmann, 75009 Paris', phone: '+33 6 33 44 55 66', email: 'pierre@splendid.fr', createdAt: '2024-06-12', updatedAt: '2024-06-15' },
  { id: '4', name: 'Camille Petit', company: 'Crèche Les Petits', address: '23 Rue des Écoles, 75005 Paris', phone: '+33 6 44 55 66 77', email: 'camille@petits.fr', createdAt: '2024-07-01', updatedAt: '2024-07-01' },
  { id: '5', name: 'Lucas Bernard', company: 'SuperMarché Bernard', address: '56 Rue du Commerce, 75015 Paris', phone: '+33 6 55 66 77 88', email: 'lucas@bernard.fr', createdAt: '2024-07-10', updatedAt: '2024-07-12' },
  { id: '6', name: 'Emma Dubois', company: 'Clinique Santé+', address: '34 Rue Médicale, 75012 Paris', phone: '+33 6 66 77 88 99', email: 'emma@santeplus.fr', createdAt: '2024-07-20', updatedAt: '2024-07-25' },
  { id: '7', name: 'Hugo Leroy', company: 'École Saint-Joseph', address: '15 Rue de l\'Éducation, 75006 Paris', phone: '+33 6 77 88 99 00', email: 'hugo@saintjoseph.fr', createdAt: '2024-08-01', updatedAt: '2024-08-01' },
  { id: '8', name: 'Sarah Morel', company: 'Pharmacie Centrale', address: '89 Rue de la Santé, 75010 Paris', phone: '+33 6 88 99 00 11', email: 'sarah@pharmacie.fr', createdAt: '2024-08-10', updatedAt: '2024-08-15' },
];

export const mockTechnicians: Technician[] = [
  { id: '1', name: 'Thomas Leroy', phone: '+33 6 11 22 33 00', email: 'thomas@hygienepro.fr', specialties: ['rodent', 'disinfection'], availability: 'available', createdAt: '2024-01-15' },
  { id: '2', name: 'Nicolas Blanc', phone: '+33 6 22 33 44 00', email: 'nicolas@hygienepro.fr', specialties: ['insect', 'disinfection'], availability: 'busy', createdAt: '2024-02-01' },
  { id: '3', name: 'Julie Roux', phone: '+33 6 33 44 55 00', email: 'julie@hygienepro.fr', specialties: ['rodent', 'insect'], availability: 'available', createdAt: '2024-03-01' },
  { id: '4', name: 'Antoine Petit', phone: '+33 6 44 55 66 00', email: 'antoine@hygienepro.fr', specialties: ['disinfection'], availability: 'off-duty', createdAt: '2024-04-01' },
  { id: '5', name: 'Céline Dubois', phone: '+33 6 55 66 77 00', email: 'celine@hygienepro.fr', specialties: ['rodent', 'disinfection', 'insect'], availability: 'available', createdAt: '2024-05-01' },
];

export const mockInterventions: Intervention[] = [
  { id: '1', type: 'rodent', status: 'scheduled', title: 'Dératisation complète', date: '2026-06-20', time: '09:00', duration: 3, address: '12 Rue de la Paix, 75001 Paris', clientId: '1', clientName: 'Boulangerie Dupont', technicianId: '1', technicianName: 'Thomas Leroy', createdAt: '2026-06-10', updatedAt: '2026-06-10' },
  { id: '2', type: 'disinfection', status: 'in-progress', title: 'Désinfection cuisine', date: '2026-06-18', time: '10:00', duration: 2, address: '45 Avenue des Champs, 75008 Paris', clientId: '2', clientName: 'Restaurant Le Gourmet', technicianId: '2', technicianName: 'Nicolas Blanc', createdAt: '2026-06-08', updatedAt: '2026-06-18' },
  { id: '3', type: 'insect', status: 'completed', title: 'Traitement insectes', date: '2026-06-15', time: '08:00', duration: 4, address: '78 Boulevard Haussmann, 75009 Paris', clientId: '3', clientName: 'Hôtel Splendid', technicianId: '3', technicianName: 'Julie Roux', createdAt: '2026-06-05', updatedAt: '2026-06-15' },
  { id: '4', type: 'rodent', status: 'completed', title: 'Inspection rongeurs', date: '2026-06-10', time: '14:00', duration: 1.5, address: '23 Rue des Écoles, 75005 Paris', clientId: '4', clientName: 'Crèche Les Petits', technicianId: '1', technicianName: 'Thomas Leroy', createdAt: '2026-06-01', updatedAt: '2026-06-10' },
  { id: '5', type: 'disinfection', status: 'cancelled', title: 'Désinfection bureau', date: '2026-06-12', time: '11:00', duration: 2, address: '56 Rue du Commerce, 75015 Paris', clientId: '5', clientName: 'SuperMarché Bernard', createdAt: '2026-06-05', updatedAt: '2026-06-11' },
  { id: '6', type: 'insect', status: 'scheduled', title: 'Traitement punaises', date: '2026-06-22', time: '09:00', duration: 3, address: '34 Rue Médicale, 75012 Paris', clientId: '6', clientName: 'Clinique Santé+', technicianId: '5', technicianName: 'Céline Dubois', createdAt: '2026-06-15', updatedAt: '2026-06-15' },
  { id: '7', type: 'rodent', status: 'scheduled', title: 'Dératisation préventive', date: '2026-06-25', time: '08:00', duration: 2, address: '15 Rue de l\'Éducation, 75006 Paris', clientId: '7', clientName: 'École Saint-Joseph', createdAt: '2026-06-18', updatedAt: '2026-06-18' },
  { id: '8', type: 'disinfection', status: 'completed', title: 'Désinfection complète', date: '2026-06-05', time: '10:00', duration: 4, address: '89 Rue de la Santé, 75010 Paris', clientId: '8', clientName: 'Pharmacie Centrale', technicianId: '4', technicianName: 'Antoine Petit', createdAt: '2026-05-25', updatedAt: '2026-06-05' },
  { id: '9', type: 'insect', status: 'in-progress', title: 'Traitement fourmis', date: '2026-06-19', time: '13:00', duration: 2, address: '12 Rue de la Paix, 75001 Paris', clientId: '1', clientName: 'Boulangerie Dupont', technicianId: '3', technicianName: 'Julie Roux', createdAt: '2026-06-12', updatedAt: '2026-06-19' },
  { id: '10', type: 'disinfection', status: 'scheduled', title: 'Désinfection virus', date: '2026-06-28', time: '09:00', duration: 3, address: '45 Avenue des Champs, 75008 Paris', clientId: '2', clientName: 'Restaurant Le Gourmet', technicianId: '5', technicianName: 'Céline Dubois', createdAt: '2026-06-20', updatedAt: '2026-06-20' },
];

export const mockActivities: ActivityItem[] = [
  { id: '1', type: 'intervention', action: 'Terminée', description: 'Désinfection complète - Pharmacie Centrale', timestamp: '2026-06-18T14:30:00Z' },
  { id: '2', type: 'client', action: 'Nouveau client', description: 'Ajout de Sarah Morel (Pharmacie Centrale)', timestamp: '2026-06-18T10:00:00Z' },
  { id: '3', type: 'intervention', action: 'Planifiée', description: 'Traitement punaises - Clinique Santé+', timestamp: '2026-06-17T16:00:00Z' },
  { id: '4', type: 'intervention', action: 'En cours', description: 'Désinfection cuisine - Restaurant Le Gourmet', timestamp: '2026-06-18T10:30:00Z' },
  { id: '5', type: 'client', action: 'Modifié', description: 'Mise à jour coordonnées - Hôtel Splendid', timestamp: '2026-06-16T09:00:00Z' },
  { id: '6', type: 'report', action: 'Généré', description: 'Rapport mensuel Mai 2026 disponible', timestamp: '2026-06-15T08:00:00Z' },
  { id: '7', type: 'intervention', action: 'Annulée', description: 'Désinfection bureau - SuperMarché Bernard', timestamp: '2026-06-14T11:00:00Z' },
];

export const mockNotifications: Notification[] = [
  { id: '1', type: 'info', title: 'Nouvelle intervention', message: 'Traitement punaises planifié pour le 22 juin', read: false, createdAt: '2026-06-18T09:00:00Z' },
  { id: '2', type: 'warning', title: 'Rappel', message: 'Intervention dératisation demain à 9h', read: false, createdAt: '2026-06-18T08:00:00Z' },
  { id: '3', type: 'success', title: 'Intervention terminée', message: 'Désinfection complète - Pharmacie Centrale', read: true, createdAt: '2026-06-17T15:00:00Z' },
  { id: '4', type: 'info', title: 'Nouveau client', message: 'Sarah Morel ajoutée comme client', read: true, createdAt: '2026-06-17T10:00:00Z' },
  { id: '5', type: 'warning', title: 'Technicien indisponible', message: 'Antoine Petit en congés cette semaine', read: false, createdAt: '2026-06-16T07:00:00Z' },
];

export const mockMonthlyStats: MonthlyStats[] = [
  { month: 'Jan', interventions: 22, clients: 5, revenue: 8500 },
  { month: 'Fév', interventions: 18, clients: 3, revenue: 7200 },
  { month: 'Mar', interventions: 25, clients: 7, revenue: 10200 },
  { month: 'Avr', interventions: 20, clients: 4, revenue: 8100 },
  { month: 'Mai', interventions: 28, clients: 6, revenue: 11500 },
  { month: 'Juin', interventions: 24, clients: 5, revenue: 9800 },
];

export const mockDashboardStats: DashboardStats = {
  scheduledInterventions: 4,
  completedInterventions: 3,
  pendingInterventions: 2,
  activeClients: 8,
  totalTechnicians: 5,
  satisfactionRate: 98,
};
