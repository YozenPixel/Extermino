import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, type Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useI18n } from '../../lib/i18n';
import { useInterventionStore } from '../../stores/appStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const locales = { fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const typeColors: Record<string, string> = {
  rodent: '#E8562A',
  disinfection: '#27AE60',
  insect: '#F0A830',
};

export default function CalendarPage() {
  const { t } = useI18n();
  const { interventions } = useInterventionStore();
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [date, setDate] = useState(new Date());
  const [, setSelectedEvent] = useState<Event | null>(null);

  const events: Event[] = useMemo(() =>
    interventions.map((i) => ({
      id: i.id,
      title: i.title,
      start: new Date(`${i.date}T${i.time}`),
      end: new Date(`${i.date}T${i.time}`),
      allDay: false,
      resource: i,
    })),
    [interventions]
  );

  const eventStyleGetter = (event: Event) => {
    const resource = (event as any).resource;
    return {
      style: {
        backgroundColor: typeColors[resource?.type] || '#636E72',
        borderRadius: '8px',
        border: 'none',
        color: 'white',
        padding: '2px 6px',
        fontSize: '12px',
        fontWeight: 500,
      },
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.calendar.title}</h1>
        <p className="text-sm text-gray-400 mt-1">{t.calendar.subtitle}</p>
      </div>

      {/* View controls */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setView('month')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'month' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            {t.calendar.month}
          </button>
          <button onClick={() => setView('week')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'week' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            {t.calendar.week}
          </button>
          <button onClick={() => setView('day')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'day' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            {t.calendar.day}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ChevronLeft size={18} /></button>
          <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
            {format(date, 'MMMM yyyy', { locale: fr })}
          </span>
          <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="rbc-wrapper" style={{ height: 650 }}>
          <Calendar
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
            onSelectEvent={(e: Event) => setSelectedEvent(e)}
            popup
            selectable
            culture="fr"
          />
        </div>
      </div>

      {/* Custom styles for the calendar */}
      <style>{`
        .rbc-calendar { font-family: 'Inter', sans-serif; }
        .rbc-header { padding: 10px 0; font-weight: 600; font-size: 13px; color: #636E72; border-bottom: 1px solid #F0F2F5; }
        .rbc-today { background-color: #FFF0EA; }
        .rbc-off-range-bg { background-color: #F8F9FA; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #F0F2F5; }
        .rbc-month-row + .rbc-month-row { border-top: 1px solid #F0F2F5; }
        .rbc-toolbar { display: none; }
        .rbc-event { padding: 2px 6px !important; }
        .rbc-show-more { color: #E8562A; font-weight: 600; font-size: 12px; }
        .rbc-date-cell { padding: 4px 8px; font-size: 13px; color: #2D3436; }
        .rbc-date-cell.rbc-now { font-weight: 700; color: #E8562A; }
        .rbc-row-segment { padding: 2px 4px; }
        .rbc-agenda-view table.rbc-agenda-table { border: 1px solid #F0F2F5; border-radius: 12px; }
        .rbc-agenda-view table.rbc-agenda-table thead > tr > th { padding: 10px; font-size: 12px; font-weight: 600; color: #636E72; border-bottom: 1px solid #F0F2F5; }
        .rbc-agenda-view table.rbc-agenda-table tbody > tr > td { padding: 10px; font-size: 13px; border-bottom: 1px solid #F0F2F5; }
        .rbc-time-view { border: none; }
        .rbc-time-content { border-top: 1px solid #F0F2F5; }
        .rbc-time-header-content { border-left: 1px solid #F0F2F5; }
        .rbc-timeslot-group { border-bottom: 1px solid #F0F2F5; }
        .rbc-time-gutter.rbc-time-column { font-size: 12px; color: #636E72; }
        .rbc-label { padding: 4px 8px; }
        .rbc-current-time-indicator { background-color: #E8562A; height: 2px; }
      `}</style>
    </div>
  );
}
