import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2, Trash2, UserPlus, X, Phone, Mail, MapPin, Building2,
  Calendar, Clock, FileText,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useClientStore, useInterventionStore } from '../../stores/appStore';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
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

export default function ClientsPage() {
  const { t, lang } = useI18n();
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const { interventions } = useInterventionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', address: '' });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', company: '', email: '', phone: '', address: '' });
    setModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone, address: client.address });
    setModalOpen(true);
  };

  const handleSave = () => {
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <UserPlus size={18} />
          {t.clients.add}
        </motion.button>
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
            <button onClick={(e) => { e.stopPropagation(); openEdit(client); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors">
              <Edit2 size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.clients.edit : t.clients.add}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.name}</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.company}</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.email}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.phone}</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.clients.address}</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              {t.clients.cancel}
            </button>
            <button onClick={handleSave} className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
              {t.clients.save}
            </button>
          </div>
        </div>
      </Modal>

      {/* Client Detail Drawer */}
      <AnimatePresence>
        {selectedClient && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setSelectedClient(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Close button */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{t.clients.title}</h2>
                  <button onClick={() => setSelectedClient(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Client avatar & name */}
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

                {/* Contact info */}
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

                {/* Stats */}
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

                {/* Intervention History */}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
