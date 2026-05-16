import { createContext, useCallback, useMemo, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContext = createContext({ notify: () => {} });

const TYPE_STYLES = {
  success: { icon: CheckCircle2, bar: 'bg-emerald-500', tone: 'text-emerald-600 dark:text-emerald-400' },
  error:   { icon: AlertTriangle, bar: 'bg-rose-500',    tone: 'text-rose-600 dark:text-rose-400' },
  info:    { icon: Info,          bar: 'bg-brand-500',   tone: 'text-brand-600 dark:text-brand-400' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, { type = 'info', duration = 3200 } = {}) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((list) => [...list, { id, message, type }]);
      if (duration) setTimeout(() => remove(id), duration);
      return id;
    },
    [remove]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((t) => {
          const conf = TYPE_STYLES[t.type] || TYPE_STYLES.info;
          const Icon = conf.icon;
          return (
            <div
              key={t.id}
              className="pointer-events-auto card flex items-start gap-3 p-4 animate-fade-in"
              role="status"
            >
              <span className={`mt-0.5 ${conf.tone}`}><Icon size={18} /></span>
              <p className="flex-1 text-sm">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
              <span className={`absolute left-0 bottom-0 h-1 w-full ${conf.bar} opacity-70 rounded-b-2xl`} />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
