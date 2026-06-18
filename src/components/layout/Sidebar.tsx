import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, Calendar, HardHat, FileBarChart, UserCircle, X } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { mockUser } from '../../stores/mockData';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard.title', end: true },
  { to: '/dashboard/clients', icon: Users, labelKey: 'clients.title' },
  { to: '/dashboard/interventions', icon: ClipboardList, labelKey: 'interventions.title' },
  { to: '/dashboard/calendar', icon: Calendar, labelKey: 'calendar.title' },
  { to: '/dashboard/technicians', icon: HardHat, labelKey: 'technicians.title' },
  { to: '/dashboard/reports', icon: FileBarChart, labelKey: 'reports.title' },
  { to: '/dashboard/profile', icon: UserCircle, labelKey: 'profile.title' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 z-30">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-xl">
            <div className="flex justify-end p-4">
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Fermer le menu">
                <X size={20} />
              </button>
            </div>
            <SidebarContent onNavClick={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { t } = useI18n();

  const navLabels: Record<string, string> = {
    'dashboard.title': t.dashboard.title,
    'clients.title': t.clients.title,
    'interventions.title': t.interventions.title,
    'calendar.title': t.calendar.title,
    'technicians.title': t.technicians.title,
    'reports.title': t.reports.title,
    'profile.title': t.profile.title,
  };

  return (
    <div className="flex flex-col h-full">
      <NavLink to="/" className="block p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">HP</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm leading-tight">Hygiène Pro</p>
            <p className="text-xs text-gray-400">Espace Pro</p>
          </div>
        </div>
      </NavLink>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavClick}
            className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden hover:bg-gray-50"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-full shadow-sm shadow-orange-500/50" />
                )}
                <item.icon size={18} className={isActive ? 'text-orange-600' : 'text-gray-400'} />
                <span className={isActive ? 'text-orange-600 font-semibold' : 'text-gray-500'}>
                  {navLabels[item.labelKey]}
                </span>
                {isActive && (
                  <span className="absolute inset-0 bg-orange-50 rounded-xl -z-10" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <NavLink to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 font-semibold text-sm">
              {mockUser.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{mockUser.name}</p>
            <p className="text-xs text-gray-400 truncate">{mockUser.email}</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
