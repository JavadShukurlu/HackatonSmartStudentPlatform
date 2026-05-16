import { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import { ROLES } from '../../utils/constants';

const Navbar = ({ onMenuClick, onCollapseToggle, collapsed = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 h-16 px-4 lg:px-6 flex items-center gap-3
                 bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl
                 border-b border-slate-200/70 dark:border-slate-800"
    >
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-xl p-2 text-slate-500 hover:bg-brand-50 dark:hover:bg-slate-800"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar collapse toggle */}
      <button
        id="sidebarToggle"
        type="button"
        onClick={onCollapseToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-pressed={collapsed}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-full
                   border border-slate-200 dark:border-slate-700
                   bg-white/70 dark:bg-slate-900/70 backdrop-blur
                   text-slate-600 dark:text-slate-300
                   hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300
                   dark:hover:bg-slate-800 dark:hover:text-brand-300
                   shadow-soft transition"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="relative flex-1 max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search students, courses, grades…"
          className="input-base pl-10"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-slate-500 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="relative rounded-xl p-2.5 text-slate-500 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
          >
            <Avatar name={user?.fullName || 'Admin'} size="md" />
            <div className="hidden md:block text-left leading-tight pr-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {user?.fullName || 'Admin'}
              </p>
              <span className={`inline-block rounded-full px-2 py-px text-[10px] font-semibold capitalize
                ${user?.role === ROLES.SUPER_ADMIN
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300'
                  : 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'
                }`}>
                {user?.role || 'admin'}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 card p-2 animate-fade-in"
              onMouseLeave={() => setProfileOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-200/70 dark:border-slate-800">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="mt-1 w-full text-left rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
