import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Megaphone, CalendarDays, PackageSearch,
  UsersRound, MessageSquare, Bell, BarChart2, Settings, LogOut, Sparkles, X, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME } from '../../utils/constants';

const NAV_ITEMS = [
  { to: '/superadmin/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/superadmin/users',         label: 'Users',          icon: Users           },
  { to: '/superadmin/announcements', label: 'Announcements',  icon: Megaphone       },
  { to: '/superadmin/events',        label: 'Events',         icon: CalendarDays    },
  { to: '/superadmin/lost-found',    label: 'Lost & Found',   icon: PackageSearch   },
  { to: '/superadmin/team-finder',   label: 'Team Finder',    icon: UsersRound      },
  { to: '/superadmin/messages',      label: 'Messages',       icon: MessageSquare   },
  { to: '/superadmin/notifications', label: 'Notifications',  icon: Bell            },
  { to: '/superadmin/statistics',    label: 'Statistics',     icon: BarChart2       },
  { to: '/superadmin/settings',      label: 'Settings',       icon: Settings        },
];

const SuperAdminSidebar = ({ open, collapsed = false, onClose }) => {
  const { logout } = useAuth();

  const logoGradient = 'from-violet-500 to-purple-300';
  const activeClass  = 'bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.45)]';
  const hoverClass   = 'text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/20';

  const widthCls = collapsed ? 'w-72 lg:w-20' : 'w-72';

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-10 h-screen shrink-0
          ${widthCls}
          bg-white/20 dark:bg-slate-950/30 backdrop-blur-xl
          border-r border-slate-200/70 dark:border-slate-800
          transition-[width,transform] duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${logoGradient} text-white shadow-[0_10px_40px_-10px_rgba(124,58,237,0.65)]`}>
              <Sparkles size={18} />
            </span>
            <div className={`leading-tight min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{APP_NAME}</p>
              <p className="text-[11px] text-violet-500 dark:text-violet-400 font-medium">Super Admin Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          <p className={`px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>
            System Control
          </p>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
                 ${collapsed ? 'lg:justify-center' : ''}
                 ${isActive ? activeClass : hoverClass}`
              }
            >
              <Icon size={18} className="shrink-0 transition-transform group-hover:scale-110" />
              <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 space-y-1">
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-1
                          bg-violet-50 dark:bg-violet-900/20 border border-violet-200/60 dark:border-violet-700/40
                          ${collapsed ? 'lg:justify-center' : ''}`}>
            <ShieldCheck size={15} className="shrink-0 text-violet-500 dark:text-violet-400" />
            <span className={`text-xs font-semibold text-violet-600 dark:text-violet-300 ${collapsed ? 'lg:hidden' : ''}`}>
              Super Admin
            </span>
          </div>
          <button
            onClick={logout}
            title={collapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                       text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition
                       ${collapsed ? 'lg:justify-center' : ''}`}
          >
            <LogOut size={18} />
            <span className={collapsed ? 'lg:hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
