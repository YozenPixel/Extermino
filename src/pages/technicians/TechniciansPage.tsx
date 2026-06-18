import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit2, Trash2, HardHat, X, Phone, Mail,
  Clock, CheckCircle2, AlertCircle, ClipboardList,
  Wrench,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useTechnicianStore, useInterventionStore } from '../../stores/appStore';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import type { Technician, InterventionType } from '../../types';

const availStyles: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  available: { bg: 'bg-green-50 text-green-600', color: '#27AE60', icon: <CheckCircle2 size={14} /> },
  busy: { bg: 'bg-orange-50 text-orange-600', color: '#F39C12', icon: <Clock size={14} /> },
  'off-duty': { bg: 'bg-red-50 text-red-500', color: '#E74C3C', icon: <AlertCircle size={14} /> },
};

const typeLabels: Record<string, { fr: string; en: string }> = {
  rodent: { fr: 'Dératisation', en: 'Rodent Control' },
  disinfection: { fr: 'Désinfection', en: 'Disinfection' },
  insect: { fr: 'Désinsectisation', en: 'Insect Control' },
};

const typeColors: Record<string, string> = {
  rodent: '#E8562A',
  disinfection: '#27AE60',
  insect: '#F0A830',
};

export default function TechniciansPage() {
  const { t, lang } = useI18n();
  const { technicians, addTechnician, updateTechnician, deleteTechnician } = useTechnicianStore();
  const { interventions } = useInterventionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Technician | null>(null);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialties: [] as InterventionType[], availability: 'available' as 'available' | 'busy' | 'off-duty' });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', specialties: [], availability: 'available' });
    setModalOpen(true);
  };

  const openEdit = (tech: Technician) => {
    setEditing(tech);
    setForm({ name: tech.name, email: tech.email, phone: tech.phone, specialties: tech.specialties, availability: tech.availability as 'available' | 'busy' | 'off-duty' });
    setModalOpen(true);
  };

  const toggleSpecialty = (s: InterventionType) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(s) ? prev.specialties.filter((x) => x !== s) : [...prev.specialties, s],
    }));
  };

  const handleSave = () => {
    if (editing) {
      updateTechnician(editing.id, form);
    } else {
      addTechnician({
        id: crypto.randomUUID(), ...form,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    setModalOpen(false);
  };

  // Compute intervention counts per technician
  const techInterventionCounts = technicians.map((tech) => ({
    tech,
    total: interventions.filter((i) => i.technicianId === tech.id).length,
    completed: interventions.filter((i) => i.technicianId === tech.id && i.status === 'completed').length,
    inProgress: interventions.filter((i) => i.technicianId === tech.id && i.status === 'in-progress').length,
    scheduled: interventions.filter((i) => i.technicianId === tech.id && i.status === 'scheduled').length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.technicians.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{t.technicians.subtitle}</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <HardHat size={18} /> {t.technicians.add}
        </motion.button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.technicians.statTechnicians, value: technicians.length, color: '#E8562A', bg: '#FFF0EA', icon: <HardHat size={20} /> },
          { label: t.technicians.statAvailable, value: technicians.filter(t => t.availability === 'available').length, color: '#27AE60', bg: '#E8F8F0', icon: <CheckCircle2 size={20} /> },
          { label: t.technicians.statBusy, value: technicians.filter(t => t.availability === 'busy').length, color: '#F39C12', bg: '#FFF8E1', icon: <Clock size={20} /> },
          { label: t.technicians.statOffDuty, value: technicians.filter(t => t.availability === 'off-duty').length, color: '#E74C3C', bg: '#FDE8E8', icon: <AlertCircle size={20} /> },
        ].map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.bg, color: item.color }}>
                {item.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <DataTable
        columns={[
          { key: 'name', label: t.technicians.name, sortable: true },
          { key: 'email', label: t.technicians.email },
          { key: 'phone', label: t.technicians.phone },
          {
            key: 'specialties', label: t.technicians.specialties,
            render: (tech: Technician) => (
              <div className="flex flex-wrap gap-1">
                {tech.specialties.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${typeColors[s]}15`, color: typeColors[s] }}>
                    {typeLabels[s][lang]}
                  </span>
                ))}
              </div>
            ),
          },
          {
            key: 'interventions', label: t.technicians.interventionsLabel,
            render: (tech: Technician) => {
              const count = interventions.filter((i) => i.technicianId === tech.id).length;
              return <span className="text-sm font-medium text-gray-700">{count}</span>;
            },
          },
          {
            key: 'availability', label: t.technicians.availability,
            render: (tech: Technician) => {
              const style = availStyles[tech.availability];
              return (
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${style.bg}`}>
                  {style.icon} {t.technicians[tech.availability as keyof typeof t.technicians]}
                </span>
              );
            },
          },
        ]}
        data={technicians}
        searchPlaceholder="Rechercher un technicien..."
        searchKeys={['name', 'email', 'phone']}
        emptyMessage={t.technicians.noTechnicians}
        onRowClick={(tech) => setSelectedTech(tech)}
        actions={(tech) => (
          <div className="flex items-center gap-2 justify-end">
            <button onClick={(e) => { e.stopPropagation(); openEdit(tech); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
            <button onClick={(e) => { e.stopPropagation(); deleteTechnician(tech.id); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.technicians.edit : t.technicians.add}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.technicians.name}</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.technicians.email}</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.technicians.phone}</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.technicians.specialties}</label>
            <div className="flex flex-wrap gap-2">
              {(['rodent', 'disinfection', 'insect'] as InterventionType[]).map((s) => (
                <button key={s} onClick={() => toggleSpecialty(s)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    form.specialties.includes(s) ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  {typeLabels[s][lang]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.technicians.availability}</label>
            <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value as 'available' | 'busy' | 'off-duty' })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20">
              {['available', 'busy', 'off-duty'].map((a) => (
                <option key={a} value={a}>{t.technicians[a as keyof typeof t.technicians]}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">{t.technicians['cancel']}</button>
            <button onClick={handleSave} className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg">{t.technicians['save']}</button>
          </div>
        </div>
      </Modal>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedTech && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setSelectedTech(null)}
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
                  <h2 className="text-xl font-bold text-gray-800">{t.technicians.technicianProfile}</h2>
                  <button onClick={() => setSelectedTech(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><X size={20} /></button>
                </div>

                {/* Avatar & name */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-xl">
                      {selectedTech.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{selectedTech.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full mt-1 ${availStyles[selectedTech.availability].bg}`}>
                      {availStyles[selectedTech.availability].icon} {t.technicians[selectedTech.availability as keyof typeof t.technicians]}
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Mail size={14} className="text-blue-500" />
                    </div>
                    <a href={`mailto:${selectedTech.email}`} className="text-gray-600 hover:text-orange-500">{selectedTech.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Phone size={14} className="text-green-500" />
                    </div>
                    <a href={`tel:${selectedTech.phone}`} className="text-gray-600 hover:text-orange-500">{selectedTech.phone}</a>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {(() => {
                    const counts = techInterventionCounts.find(c => c.tech.id === selectedTech.id);
                    return [
                      { label: t.technicians.total, value: counts?.total || 0, color: '#E8562A', bg: '#FFF0EA' },
                      { label: t.technicians.completedLabel, value: counts?.completed || 0, color: '#27AE60', bg: '#E8F8F0' },
                      { label: t.technicians.inProgressLabel, value: counts?.inProgress || 0, color: '#F39C12', bg: '#FFF8E1' },
                    ].map((stat, i) => (
                      <div key={i} className="text-center p-3 rounded-xl" style={{ backgroundColor: stat.bg }}>
                        <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ));
                  })()}
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{t.technicians.specialtiesLabel}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTech.specialties.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: `${typeColors[s]}15`, color: typeColors[s] }}>
                        <Wrench size={14} /> {typeLabels[s][lang]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned interventions */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    <ClipboardList size={14} className="inline mr-1" />
                    {t.technicians.interventionsLabel} ({interventions.filter(i => i.technicianId === selectedTech.id).length})
                  </h4>
                  {interventions.filter(i => i.technicianId === selectedTech.id).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-400">{t.technicians.noInterventionsAssigned}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {interventions
                        .filter(i => i.technicianId === selectedTech.id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((intervention) => (
                          <div key={intervention.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: typeColors[intervention.type] }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">{intervention.title}</p>
                              <p className="text-xs text-gray-400">{intervention.date} • {intervention.clientName}</p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              intervention.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                              intervention.status === 'in-progress' ? 'bg-orange-50 text-orange-600' :
                              intervention.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                            }`}>
                              {t.interventions[intervention.status === 'in-progress' ? 'inProgress' : intervention.status]}
                            </span>
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
