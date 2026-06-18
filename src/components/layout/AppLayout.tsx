import { useState, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, ArrowLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useDashboardStore } from '../../stores/appStore';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useI18n();
  const { notifications } = useDashboardStore();
  const location = useLocation();
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Breadcrumb mapping: path segment → i18n translation key
  const { segments, labels } = useMemo(() => {
    const segmentMap: Record<string, string> = {
      dashboard: t.dashboard.title,
      clients: t.clients.title,
      interventions: t.interventions.title,
      technicians: t.technicians.title,
      calendar: t.calendar.title,
      reports: t.reports.title,
      profile: t.profile.title,
    };

    const segs = location.pathname.split('/').filter(Boolean);
    return {
      segments: segs,
      labels: segs.map((seg) => segmentMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)),
    };
  }, [location.pathname, t]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div className="relative hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Back to site */}
              <Link
                to="/"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50"
              >
                <ArrowLeft size={14} />
                {t.nav.backToSite}
              </Link>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
                )}
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <nav className="px-4 lg:px-8 pb-3" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-orange-500 transition-colors">
                  {t.dashboard.title}
                </Link>
              </li>
              {labels.slice(1).map((crumb, i) => {
                const isLast = i === labels.slice(1).length - 1;
                // Build the full path for this segment: /dashboard/segment1/segment2/...
                const path = '/' + segments.slice(0, i + 2).join('/');
                return (
                  <li key={i} className="flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-gray-300" />
                    {isLast ? (
                      <span className="text-gray-700 font-medium">{crumb}</span>
                    ) : (
                      <Link to={path} className="text-gray-400 hover:text-orange-500 transition-colors">
                        {crumb}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
