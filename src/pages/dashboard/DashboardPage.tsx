import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle2, Clock, Users, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useDashboardStore, useInterventionStore } from '../../stores/appStore';
import StatsCard from '../../components/ui/StatsCard';

const statusColors: Record<string, { bg: string; color: string }> = {
  scheduled: { bg: '#EBF5FF', color: '#3498DB' },
  'in-progress': { bg: '#FFF8E1', color: '#F39C12' },
  completed: { bg: '#E8F8F0', color: '#27AE60' },
  cancelled: { bg: '#FDE8E8', color: '#E74C3C' },
};

const typeColors: Record<string, string> = {
  rodent: '#E8562A',
  disinfection: '#27AE60',
  insect: '#F0A830',
};

const notifTypeIcons: Record<string, React.ReactNode> = {
  info: <Info size={16} />,
  warning: <AlertCircle size={16} className="text-orange-500" />,
  success: <CheckCircle size={16} />,
  error: <AlertCircle size={16} className="text-red-500" />,
};

const notifColors: Record<string, string> = {
  info: 'bg-blue-50 border-blue-100',
  warning: 'bg-orange-50 border-orange-100',
  success: 'bg-green-50 border-green-100',
  error: 'bg-red-50 border-red-100',
};

export default function DashboardPage() {
  const { t } = useI18n();
  const { stats, activities, notifications, markNotificationRead } = useDashboardStore();
  const { interventions } = useInterventionStore();

  const upcoming = interventions.filter((i) => i.status === 'scheduled').slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.dashboard.title}</h1>
        <p className="text-sm text-gray-400 mt-1">{t.dashboard.subtitle}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<CalendarCheck size={22} />} label={t.dashboard.scheduled} value={stats.scheduledInterventions} color="#3498DB" trend={{ value: '+12%', positive: true }} />
        <StatsCard icon={<CheckCircle2 size={22} />} label={t.dashboard.completed} value={stats.completedInterventions} color="#27AE60" />
        <StatsCard icon={<Clock size={22} />} label={t.dashboard.pending} value={stats.pendingInterventions} color="#F39C12" />
        <StatsCard icon={<Users size={22} />} label={t.dashboard.clients} value={stats.activeClients} color="#E8562A" trend={{ value: '+8%', positive: true }} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{t.dashboard.recentActivity}</h2>
            <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">{t.dashboard.viewAll}</button>
          </div>
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'intervention' ? 'bg-orange-50 text-orange-500' :
                  activity.type === 'client' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                }`}>
                  {activity.type === 'intervention' ? <CalendarCheck size={16} /> :
                   activity.type === 'client' ? <Users size={16} /> : <CheckCircle2 size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">
                    <span className="font-semibold">{activity.action}</span> — {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(activity.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.dashboard.notifications}</h2>
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">{t.dashboard.noNotifications}</p>
              ) : (
                notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border text-sm cursor-pointer transition-colors ${notifColors[n.type]} ${n.read ? 'opacity-60' : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">{notifTypeIcons[n.type]}</span>
                      <div>
                        <p className="font-medium text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming interventions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.dashboard.upcoming}</h2>
            <div className="space-y-3">
              {upcoming.map((intervention) => (
                <div key={intervention.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: typeColors[intervention.type] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{intervention.title}</p>
                    <p className="text-xs text-gray-400">{intervention.date} à {intervention.time}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    statusColors[intervention.status]?.bg || 'bg-gray-100'
                  }`} style={{ color: statusColors[intervention.status]?.color }}>
                    {intervention.status === 'scheduled' ? 'Planifiée' : intervention.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
