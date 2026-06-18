import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2, Trash2, ClipboardList, X, Calendar, Clock, MapPin,
  User, Building2, Filter, Phone, Mail,
  AlertCircle, CheckCircle2, Clock as ClockIcon,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useInterventionStore, useClientStore, useTechnicianStore } from '../../stores/appStore';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import type { Intervention, InterventionStatus, InterventionType } from '../../types';

const statusStyles: Record<InterventionStatus, string> = {
  scheduled: 'bg-blue-50 text-blue-600',
  'in-progress': 'bg-orange-50 text-orange-600',
  completed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
};

const statusIcons: Record<InterventionStatus, React.ReactNode> = {
  scheduled: <Calendar size={14} />,
  'in-progress': <ClockIcon size={14} />,
  completed: <CheckCircle2 size={14} />,
  cancelled: <AlertCircle size={14} />,
};

const typeColors: Record<InterventionType, string> = {
  rodent: '#E8562A',
  disinfection: '#27AE60',
  insect: '#F0A830',
};

const typeIcons: Record<InterventionType, string> = {
  rodent: '🐀',
  disinfection: '🧪',
  insect: '🐛',
};

const statusOptions: InterventionStatus[] = ['scheduled', 'in-progress', 'completed', 'cancelled'];

export default function InterventionsPage() {
  const { t, lang } = useI18n();
  const { interventions, addIntervention, updateIntervention, deleteIntervention } = useInterventionStore();
  const { clients } = useClientStore();
  const { technicians } = useTechnicianStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Intervention | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [statusFilter, setStatusFilter] = useState<InterventionStatus | 'all'>('all');
  const [form, setForm] = useState({
    title: '', type: 'rodent' as InterventionType, date: '', time: '',
    duration: 2, address: '', clientId: '', technicianId: '', status: 'scheduled' as InterventionStatus,
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', type: 'rodent', date: '', time: '', duration: 2, address: '', clientId: '', technicianId: '', status: 'scheduled' });
    setModalOpen(true);
  };

  const openEdit = (intervention: Intervention) => {
    setEditing(intervention);
    setForm({
      title: intervention.title, type: intervention.type, date: intervention.date, time: intervention.time,
      duration: intervention.duration, address: intervention.address, clientId: intervention.clientId,
      technicianId: intervention.technicianId || '', status: intervention.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const client = clients.find((c) => c.id === form.clientId);
    const tech = technicians.find((t) => t.id === form.technicianId);
    const now = new Date().toISOString();
    if (editing) {
      updateIntervention(editing.id, {
        ...form, clientName: client?.company || '', technicianName: tech?.name, updatedAt: now,
      });
    } else {
      addIntervention({
        id: crypto.randomUUID(), ...form, clientName: client?.company || '',
        technicianName: tech?.name, createdAt: now, updatedAt: now,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.interventions.confirmDelete)) deleteIntervention(id);
  };

  const filteredInterventions = statusFilter === 'all'
    ? interventions
    : interventions.filter((i) => i.status === statusFilter);

  const statusCounts = {
    all: interventions.length,
    scheduled: interventions.filter((i) => i.status === 'scheduled').length,
    'in-progress': interventions.filter((i) => i.status === 'in-progress').length,
    completed: interventions.filter((i) => i.status === 'completed').length,
    cancelled: interventions.filter((i) => i.status === 'cancelled').length,
  };

  const columns = [
    { key: 'title', label: t.interventions.titleLabel, sortable: true },
    { key: 'date', label: t.interventions.date, sortable: true },
    { key: 'time', label: t.interventions.time },
    {
      key: 'type', label: t.interventions.type, render: (i: Intervention) => (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors[i.type] }} />
          <span className="font-medium text-sm text-gray-700">{t.interventions[i.type]}</span>
        </span>
      ),
    },
    {
      key: 'status', label: t.interventions.status, render: (i: Intervention) => (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[i.status]}`}>
          {statusIcons[i.status]} {t.interventions[i.status]}
        </span>
      ),
    },
    { key: 'technicianName', label: t.interventions.technician },
    { key: 'clientName', label: t.interventions.client },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.interventions.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{t.interventions.subtitle}</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <ClipboardList size={18} /> {t.interventions.add}
        </motion.button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(['all', ...statusOptions] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === status
                ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-200'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {status !== 'all' && statusIcons[status]}
            {status === 'all' ? (
              <><Filter size={14} /> {t.interventions.all}</>
            ) : (
              t.interventions[status]
            )}
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
              statusFilter === status ? 'bg-orange-200/50 text-orange-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredInterventions}
        searchPlaceholder={t.interventions.search}
        searchKeys={['title', 'clientName', 'technicianName', 'address']}
        emptyMessage={t.interventions.noInterventions}
        onRowClick={(intervention) => setSelectedIntervention(intervention)}
        actions={(intervention) => (
          <div className="flex items-center gap-2 justify-end">
            <button onClick={(e) => { e.stopPropagation(); openEdit(intervention); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(intervention.id); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.interventions.edit : t.interventions.add} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.titleLabel}</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.type}</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as InterventionType })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white">
                {(['rodent', 'disinfection', 'insect'] as InterventionType[]).map((type) => (
                  <option key={type} value={type}>{t.interventions[type]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.status}</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as InterventionStatus })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white">
                {(['scheduled', 'in-progress', 'completed', 'cancelled'] as InterventionStatus[]).map((s) => (
                  <option key={s} value={s}>{t.interventions[s]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.date}</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.time}</label>
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.client}</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white">
                <option value="">{t.interventions.select}</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.company}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.technician}</label>
              <select value={form.technicianId} onChange={(e) => setForm({ ...form, technicianId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white">
                <option value="">{t.interventions.select}</option>
                {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.address}</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">{t.interventions.cancel}</button>
            <button onClick={handleSave} className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">{t.interventions.save}</button>
          </div>
        </div>
      </Modal>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedIntervention && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setSelectedIntervention(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{t.interventions.detailTitle}</h2>
                  <button onClick={() => setSelectedIntervention(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Header */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${typeColors[selectedIntervention.type]}15` }}>
                    {typeIcons[selectedIntervention.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{selectedIntervention.title}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{t.interventions[selectedIntervention.type]}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[selectedIntervention.status]}`}>
                        {statusIcons[selectedIntervention.status]} {t.interventions[selectedIntervention.status]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{t.interventions.date}</p>
                      <p className="text-gray-700 font-medium">
                        {new Date(selectedIntervention.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{t.interventions.time}</p>
                      <p className="text-gray-700 font-medium">{selectedIntervention.time} ({selectedIntervention.duration}h)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{t.interventions.address}</p>
                      <p className="text-gray-700 font-medium">{selectedIntervention.address}</p>
                    </div>
                  </div>
                </div>

                {/* Client & Technician */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t.interventions.client}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{selectedIntervention.clientName}</p>
                    {clients.find(c => c.id === selectedIntervention.clientId) && (
                      <>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Phone size={11} /> {clients.find(c => c.id === selectedIntervention.clientId)?.phone}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail size={11} /> {clients.find(c => c.id === selectedIntervention.clientId)?.email}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t.interventions.technician}</span>
                    </div>
                    {selectedIntervention.technicianName ? (
                      <>
                        <p className="text-sm font-semibold text-gray-800">{selectedIntervention.technicianName}</p>
                        {technicians.find(t => t.id === selectedIntervention.technicianId) && (
                          <p className="text-xs text-gray-400 mt-1">
                            {technicians.find(t => t.id === selectedIntervention.technicianId)?.specialties.map(s => t.interventions[s]).join(', ')}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">{t.interventions.unassigned}</p>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{t.interventions.information}</h4>
                  <div className="space-y-3 text-sm text-gray-500">
                    <p className="flex items-center justify-between">
                      <span>{t.interventions.createdOn}</span>
                      <span className="text-gray-700 font-medium">
                        {new Date(selectedIntervention.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>{t.interventions.lastModified}</span>
                      <span className="text-gray-700 font-medium">
                        {new Date(selectedIntervention.updatedAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>{t.interventions.estimatedDuration}</span>
                      <span className="text-gray-700 font-medium">{selectedIntervention.duration} {t.interventions.hours}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
