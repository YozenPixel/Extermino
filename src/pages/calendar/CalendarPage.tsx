import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, type Event, type SlotInfo } from 'react-big-calendar';
import withDragAndDropFromLib from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useI18n } from '../../lib/i18n';
import { useInterventionStore, useClientStore, useTechnicianStore } from '../../stores/appStore';
import {
  ChevronLeft, ChevronRight, CalendarDays,
  Edit2, Trash2, Clock, MapPin, User, Building2,
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/Button/Button';
import type { Intervention, InterventionType } from '../../types';

const locales = { fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Handle CJS/ESM interop for the dragAndDrop addon
const withDragAndDrop = (withDragAndDropFromLib as any).default || withDragAndDropFromLib;
const DragAndDropCalendar = withDragAndDrop(Calendar);

const typeColors: Record<string, string> = {
  rodent: '#E8562A',
  disinfection: '#27AE60',
  insect: '#F0A830',
};

const statusStyles: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-600',
  'in-progress': 'bg-orange-50 text-orange-600',
  completed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
};

const statusLabelKey = {
  scheduled: 'scheduled',
  'in-progress': 'inProgress',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

// Business hours for week/day views
const minDate = (() => { const d = new Date(); d.setHours(7, 0, 0, 0); return d; })();
const maxDate = (() => { const d = new Date(); d.setHours(19, 0, 0, 0); return d; })();

const initialQuickForm = {
  title: '',
  type: 'rodent' as InterventionType,
  clientId: '',
  technicianId: '',
  time: '09:00',
};

function computeEnd(start: string, time: string, duration: number): Date {
  return addHours(new Date(`${start}T${time}`), duration);
}

export default function CalendarPage() {
  const { t, lang } = useI18n();
  const { interventions, addIntervention, updateIntervention, deleteIntervention } = useInterventionStore();
  const { clients } = useClientStore();
  const { technicians } = useTechnicianStore();

  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [date, setDate] = useState(new Date());
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [quickForm, setQuickForm] = useState(initialQuickForm);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; dateStr: string } | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEventIntervention, setSelectedEventIntervention] = useState<Intervention | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ──────────────────────────────────────────────
  // Events from interventions
  // ──────────────────────────────────────────────
  const events: Event[] = useMemo(() =>
    interventions.map((i) => ({
      id: i.id,
      title: i.title,
      start: new Date(`${i.date}T${i.time}`),
      end: computeEnd(i.date, i.time, i.duration),
      allDay: false,
      resource: i,
    })),
    [interventions],
  );

  // ──────────────────────────────────────────────
  // Navigate helpers
  // ──────────────────────────────────────────────
  const goToToday = useCallback(() => setDate(new Date()), []);
  const navigate = useCallback((direction: -1 | 1) => {
    const units: Record<string, 'month' | 'week' | 'day'> = { month: 'month', week: 'week', day: 'day' };
    const unit = units[view] || 'month';
    if (unit === 'month') {
      setDate((d) => new Date(d.getFullYear(), d.getMonth() + direction, 1));
    } else if (unit === 'week') {
      setDate((d) => {
        const next = new Date(d);
        next.setDate(next.getDate() + 7 * direction);
        return next;
      });
    } else {
      setDate((d) => {
        const next = new Date(d);
        next.setDate(next.getDate() + direction);
        return next;
      });
    }
  }, [view]);

  // ──────────────────────────────────────────────
  // Quick create on slot click
  // ──────────────────────────────────────────────
  const handleSelectSlot = useCallback((slot: SlotInfo) => {
    const dateStr = format(slot.start, 'yyyy-MM-dd');
    const time = format(slot.start, 'HH:mm');
    setEditingId(null);
    setSelectedSlot({ start: slot.start, dateStr });
    setQuickForm({ ...initialQuickForm, time });
    setQuickModalOpen(true);
  }, []);

  const handleQuickSave = useCallback(() => {
    if (!selectedSlot || !quickForm.title.trim() || !quickForm.clientId) return;

    const client = clients.find((c) => c.id === quickForm.clientId);
    const tech = technicians.find((t) => t.id === quickForm.technicianId);
    const now = new Date().toISOString();

    if (editingId) {
      // Update existing intervention
      updateIntervention(editingId, {
        title: quickForm.title,
        type: quickForm.type,
        date: selectedSlot.dateStr,
        time: quickForm.time,
        clientId: quickForm.clientId,
        clientName: client?.company || '',
        technicianId: quickForm.technicianId || undefined,
        technicianName: tech?.name,
        updatedAt: now,
      });
    } else {
      // Create new intervention
      addIntervention({
        id: crypto.randomUUID(),
        title: quickForm.title,
        type: quickForm.type,
        status: 'scheduled',
        date: selectedSlot.dateStr,
        time: quickForm.time,
        duration: 2,
        address: client?.address || '',
        clientId: quickForm.clientId,
        clientName: client?.company || '',
        technicianId: quickForm.technicianId || undefined,
        technicianName: tech?.name,
        createdAt: now,
        updatedAt: now,
      });
    }

    setQuickModalOpen(false);
    setEditingId(null);
    setQuickForm(initialQuickForm);
    setSelectedSlot(null);
  }, [selectedSlot, quickForm, clients, technicians, addIntervention, updateIntervention, editingId]);

  // ──────────────────────────────────────────────
  // Event detail popover
  // ──────────────────────────────────────────────
  const handleSelectEvent = useCallback((event: Event) => {
    const resource = (event as any).resource as Intervention | undefined;
    if (resource) {
      setSelectedEventIntervention(resource);
      setDetailModalOpen(true);
    }
  }, []);

  const handleEditFromDetail = useCallback(() => {
    setDetailModalOpen(false);
    if (selectedEventIntervention) {
      const dateStr = selectedEventIntervention.date;
      const time = selectedEventIntervention.time;
      setEditingId(selectedEventIntervention.id);
      setSelectedSlot({ start: new Date(`${dateStr}T${time}`), dateStr });
      setQuickForm({
        title: selectedEventIntervention.title,
        type: selectedEventIntervention.type,
        clientId: selectedEventIntervention.clientId,
        technicianId: selectedEventIntervention.technicianId || '',
        time: selectedEventIntervention.time,
      });
      setQuickModalOpen(true);
    }
  }, [selectedEventIntervention]);

  const handleDeleteFromDetail = useCallback(() => {
    if (selectedEventIntervention && window.confirm(t.interventions.confirmDelete)) {
      deleteIntervention(selectedEventIntervention.id);
      setDetailModalOpen(false);
      setSelectedEventIntervention(null);
    }
  }, [selectedEventIntervention, deleteIntervention, t]);

  // ──────────────────────────────────────────────
  // Drag & drop to reschedule
  // ──────────────────────────────────────────────
  const handleEventDrop = useCallback(({ event, start, isAllDay: droppedOnAllDaySlot }: {
    event: Event; start: Date; isAllDay: boolean;
  }) => {
    const resource = (event as any).resource as Intervention | undefined;
    if (!resource) return;

    const newDate = format(start, 'yyyy-MM-dd');
    const newTime = format(start, 'HH:mm');

    // Preserve the original time if dropped on the all-day header area
    const time = droppedOnAllDaySlot ? resource.time : newTime;

    updateIntervention(resource.id, {
      date: newDate,
      time,
      updatedAt: new Date().toISOString(),
    });
  }, [updateIntervention]);

  // ──────────────────────────────────────────────
  // Event styling
  // ──────────────────────────────────────────────
  const eventStyleGetter = useCallback((event: Event) => {
    const resource = (event as any).resource;
    return {
      style: {
        backgroundColor: typeColors[resource?.type] || '#636E72',
        borderRadius: '8px',
        border: 'none',
        color: 'white',
        padding: '2px 6px',
        fontSize: '12px',
        fontWeight: 500 as const,
        cursor: 'pointer',
      },
    };
  }, []);

  // ──────────────────────────────────────────────
  // Format header date
  // ──────────────────────────────────────────────
  const headerDateLabel = useMemo(() => {
    if (view === 'month') return format(date, 'MMMM yyyy', { locale: fr });
    if (view === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${format(start, 'd', { locale: fr })} – ${format(end, 'd MMMM yyyy', { locale: fr })}`;
    }
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  }, [date, view]);

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.calendar.title}</h1>
            <p className="text-sm text-gray-400 mt-1">{t.calendar.subtitle}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4">
          {/* View switcher */}
          <div className="flex items-center gap-2">
            {(['month', 'week', 'day'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  view === v ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {t.calendar[v]}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button onClick={goToToday}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CalendarDays size={16} />
              {t.calendar.today || "Aujourd'hui"}
            </button>
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold text-gray-700 min-w-[160px] text-center capitalize">
                {headerDateLabel}
              </span>
              <button onClick={() => navigate(1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div style={{ height: view === 'month' ? 650 : 750 }}>
            <DragAndDropCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              onView={(v: string) => setView(v as 'month' | 'week' | 'day')}
              date={date}
              onNavigate={(d: Date) => setDate(d)}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              onEventDrop={handleEventDrop}
              selectable
              resizable={false}
              popup
              culture="fr"
              min={minDate}
              max={maxDate}
              step={30}
              timeslots={2}
              defaultDate={new Date()}
              components={{
                event: (props: { event: Event; title: string }) => (
                  <div title={props.title} style={{ padding: 0 }}>
                    {props.title}
                  </div>
                ),
              }}
            />
          </div>
        </div>

        {/* ─── Quick Create Modal ─── */}
        <Modal open={quickModalOpen} onClose={() => { setQuickModalOpen(false); setSelectedSlot(null); setEditingId(null); }}
          title={t.interventions.add} size="md"
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.titleLabel}</label>
              <input type="text" value={quickForm.title}
                onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })}
                placeholder="Ex: Dératisation complète"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                autoFocus
              />
            </div>

            {/* Type & Time row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.type}</label>
                <select value={quickForm.type}
                  onChange={(e) => setQuickForm({ ...quickForm, type: e.target.value as InterventionType })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white"
                >
                  {(['rodent', 'disinfection', 'insect'] as InterventionType[]).map((type) => (
                    <option key={type} value={type}>{t.interventions[type]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.time}</label>
                <input type="time" value={quickForm.time}
                  onChange={(e) => setQuickForm({ ...quickForm, time: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                />
              </div>
            </div>

            {/* Client & Technician row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.client}</label>
                <select value={quickForm.clientId}
                  onChange={(e) => setQuickForm({ ...quickForm, clientId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white"
                >
                  <option value="">{t.interventions.select}</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.company}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.interventions.technician}</label>
                <select value={quickForm.technicianId}
                  onChange={(e) => setQuickForm({ ...quickForm, technicianId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white"
                >
                  <option value="">{t.interventions.select}</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => { setQuickModalOpen(false); setSelectedSlot(null); setEditingId(null); }}>
                {t.interventions.cancel}
              </Button>
              <Button onClick={handleQuickSave} disabled={!quickForm.title.trim() || !quickForm.clientId}>
                {t.interventions.save}
              </Button>
            </div>
          </div>
        </Modal>

        {/* ─── Event Detail Modal ─── */}
        <Modal open={detailModalOpen} onClose={() => { setDetailModalOpen(false); setSelectedEventIntervention(null); }}
          title={t.interventions.detailTitle} size="sm"
        >
          {selectedEventIntervention && (
            <div className="space-y-5">
              {/* Header with type indicator */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: `${typeColors[selectedEventIntervention.type]}15` }}
                >
                  {selectedEventIntervention.type === 'rodent' ? '🐀'
                    : selectedEventIntervention.type === 'disinfection' ? '🧪'
                    : '🐛'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-800 truncate">{selectedEventIntervention.title}</h3>
                  <p className="text-sm text-gray-400">{t.interventions[selectedEventIntervention.type]}</p>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyles[selectedEventIntervention.status]}`}>
                  {t.interventions[statusLabelKey[selectedEventIntervention.status]]}
                </span>
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{t.interventions.date}</p>
                    <p className="text-gray-700 font-medium">
                      {new Date(selectedEventIntervention.date + 'T' + selectedEventIntervention.time)
                        .toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                        })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{t.interventions.time}</p>
                    <p className="text-gray-700 font-medium">
                      {selectedEventIntervention.time} ({selectedEventIntervention.duration}h)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{t.interventions.client}</p>
                    <p className="text-gray-700 font-medium">{selectedEventIntervention.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{t.interventions.technician}</p>
                    <p className="text-gray-700 font-medium">
                      {selectedEventIntervention.technicianName || t.interventions.unassigned}
                    </p>
                  </div>
                </div>
                {selectedEventIntervention.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{t.interventions.address}</p>
                      <p className="text-gray-700 font-medium">{selectedEventIntervention.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <Button variant="outline" size="sm" icon={<Edit2 size={14} />}
                  onClick={handleEditFromDetail}
                  className="flex-1 justify-center !border-gray-200 !text-gray-600 hover:!bg-gray-50"
                >
                  {t.interventions.edit}
                </Button>
                <Button variant="ghost" size="sm" icon={<Trash2 size={14} />}
                  onClick={handleDeleteFromDetail}
                  className="flex-1 justify-center !text-red-500 hover:!bg-red-50"
                >
                  {t.interventions.delete}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* ─── Custom styles ─── */}
        <style>{`
          .rbc-calendar { font-family: 'Inter', sans-serif; }
          .rbc-header { padding: 10px 0; font-weight: 600; font-size: 13px; color: #636E72; border-bottom: 1px solid #F0F2F5; }
          .rbc-today { background-color: #FFF0EA; }
          .rbc-off-range-bg { background-color: #F8F9FA; }
          .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #F0F2F5; }
          .rbc-month-row + .rbc-month-row { border-top: 1px solid #F0F2F5; }
          .rbc-toolbar { display: none; }
          .rbc-event { padding: 2px 6px !important; cursor: pointer !important; }
          .rbc-show-more { color: #E8562A; font-weight: 600; font-size: 12px; }
          .rbc-date-cell { padding: 4px 8px; font-size: 13px; color: #2D3436; }
          .rbc-date-cell.rbc-now { font-weight: 700; color: #E8562A; }
          .rbc-row-segment { padding: 2px 4px; }
          .rbc-time-view { border: none; }
          .rbc-time-content { border-top: 1px solid #F0F2F5; }
          .rbc-time-header-content { border-left: 1px solid #F0F2F5; }
          .rbc-timeslot-group { border-bottom: 1px solid #F0F2F5; }
          .rbc-time-gutter.rbc-time-column { font-size: 12px; color: #636E72; }
          .rbc-label { padding: 4px 8px; }
          .rbc-current-time-indicator { background-color: #E8562A; height: 2px; }
          .rbc-day-slot .rbc-events-container { margin-right: 0 !important; }
          .rbc-day-slot .rbc-event { border: none !important; }
          .rbc-addons-dnd .rbc-addons-dnd-over { background-color: rgba(232, 86, 42, 0.08); }
          .rbc-addons-dnd .rbc-addons-dnd-dragging { opacity: 0.6; }
          .rbc-time-slot { cursor: pointer; }
          .rbc-time-slot:hover { background-color: #FFF5F0; }
          .rbc-day-slot .rbc-time-slot { border-top: 1px solid #F5F5F5; }
          .rbc-agenda-view table.rbc-agenda-table { border: 1px solid #F0F2F5; border-radius: 12px; }
          .rbc-agenda-view table.rbc-agenda-table thead > tr > th { padding: 10px; font-size: 12px; font-weight: 600; color: #636E72; border-bottom: 1px solid #F0F2F5; }
          .rbc-agenda-view table.rbc-agenda-table tbody > tr > td { padding: 10px; font-size: 13px; border-bottom: 1px solid #F0F2F5; }
        `}</style>
      </div>
    </DndProvider>
  );
}
