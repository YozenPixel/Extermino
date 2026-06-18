import { useState } from 'react';
import {
  Edit2, Trash2, UserPlus, Phone, Mail, MapPin, Building2,
  Calendar, Clock, FileText,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useClientStore, useInterventionStore } from '../../stores/appStore';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import DetailDrawer from '../../components/ui/DetailDrawer';
import Button from '../../components/Button/Button';
import type { Client, InterventionType } from '../../types';

const statusStyles: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-600',
  'in-progress': 'bg-orange-50 text-orange-600',
  completed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
};

const typeColors: Record<InterventionType, string> = {
  rodent: '#E8562A',
  disinfection: '#27AE60',
  insect: '#F0A830',
};

interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

function validateClientForm(form: typeof initialForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Le nom est requis';
  if (!form.email.trim()) errors.email = 'L\'email est requis';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email invalide';
  if (!form.phone.trim()) errors.phone = 'Le téléphone est requis';
  return errors;
}

const initialForm = { name: '', company: '', email: '', phone: '', address: '' };

export default function ClientsPage() {
  const { t, lang } = useI18n();
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const { interventions } = useInterventionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const openAdd = () => {
    setEditing(null);
    setForm(initialForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone, address: client.address });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    const validation = validateClientForm(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    if (editing) {
      updateClient(editing.id, form);
    } else {
      addClient({
        id: crypto.randomUUID(),
        ...form,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      });
    }
    setModalOpen(false);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.clients.confirmDelete)) {
      deleteClient(id);
    }
  };

  const clientInterventions = selectedClient
    ? interventions.filter((i) => i.clientId === selectedClient.id)
    : [];

  const columns = [
    { key: 'name', label: t.clients.name, sortable: true },
    { key: 'company', label: t.clients.company, sortable: true },
    { key: 'email', label: t.clients.email },
    { key: 'phone', label: t.clients.phone },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.clients.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{t.clients.subtitle}</p>
        </div>
        <Button onClick={openAdd} icon={<UserPlus size={18} />}>
          {t.clients.add}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        searchPlaceholder={t.clients.search}
        searchKeys={['name', 'company', 'email', 'phone', 'address']}
        emptyMessage={t.clients.noClients}
        onRowClick={(client) => setSelectedClient(client)}
        actions={(client) => (
          <div className="flex items-center gap-2 justify-end">
            <button onClick={(e) => { e.stopPropagation(); openEdit(client); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors" aria-label={t.clients.edit}>
              <Edit2 size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors" aria-label={t.clients.delete}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.clients.edit : t.clients.add}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.name}</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.company}</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${errors.company ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'}`} />
              {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.email}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.phone}</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${errors.phone ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'}`} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.address}</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>{t.clients.cancel}</Button>
            <Button onClick={handleSave}>{t.clients.save}</Button>
          </div>
        </div>
      </Modal>

      <DetailDrawer open={!!selectedClient} onClose={() => setSelectedClient(null)} title={t.clients.title}>
        {selectedClient && (
          <>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xl">
                  {selectedClient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedClient.name}</h3>
                <p className="text-sm text-gray-400">{selectedClient.company}</p>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Calendar size={12} /> {t.clients.clientSince} {new Date(selectedClient.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{t.clients.contact}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-blue-500" />
                  </div>
                  <a href={`mailto:${selectedClient.email}`} className="text-gray-600 hover:text-orange-500 transition-colors">{selectedClient.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-green-500" />
                  </div>
                  <a href={`tel:${selectedClient.phone}`} className="text-gray-600 hover:text-orange-500 transition-colors">{selectedClient.phone}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-purple-500" />
                  </div>
                  <span className="text-gray-600">{selectedClient.address}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: t.clients.interventionsLabel, value: clientInterventions.length, color: '#E8562A', bg: '#FFF0EA' },
                { label: t.clients.completedLabel, value: clientInterventions.filter(i => i.status === 'completed').length, color: '#27AE60', bg: '#E8F8F0' },
                { label: t.clients.scheduledLabel, value: clientInterventions.filter(i => i.status === 'scheduled').length, color: '#3498DB', bg: '#EBF5FF' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-3 rounded-xl" style={{ backgroundColor: stat.bg }}>
                  <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t.clients.interventionHistory} ({clientInterventions.length})
              </h4>
              {clientInterventions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">{t.clients.noInterventionsForClient}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientInterventions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((intervention) => (
                    <div key={intervention.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors[intervention.type] }} />
                          <h5 className="text-sm font-semibold text-gray-800">{intervention.title}</h5>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[intervention.status]}`}>
                          {t.interventions[intervention.status === 'in-progress' ? 'inProgress' : intervention.status]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {new Date(intervention.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {intervention.time}
                        </span>
                        {intervention.technicianName && (
                          <span className="flex items-center gap-1">
                            <Building2 size={12} /> {intervention.technicianName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <MapPin size={12} /> {intervention.address}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </DetailDrawer>
    </div>
  );
}
