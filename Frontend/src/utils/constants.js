// Application-wide constants. Backend devs: tweak only env-based URLs in .env.

export const APP_NAME = 'Smart Campus Portal';

export const ROLES = Object.freeze({
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
});

export const ROLE_BADGE_CLASS = {
  [ROLES.SUPER_ADMIN]: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  [ROLES.ADMIN]: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  [ROLES.TEACHER]: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  [ROLES.STUDENT]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
};

export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'scp_token',
  USER: 'scp_user',
  THEME: 'scp_theme',
});

export const PAGE_SIZE_DEFAULT = 8;

/** Return the dashboard path for a given role. */
export const getRoleDashboard = (role) => {
  if (role === ROLES.SUPER_ADMIN) return '/superadmin/dashboard';
  return '/admin/dashboard';
};

/** Return the base prefix for a given role. */
export const getRolePrefix = (role) => {
  if (role === ROLES.SUPER_ADMIN) return '/superadmin';
  return '/admin';
};
