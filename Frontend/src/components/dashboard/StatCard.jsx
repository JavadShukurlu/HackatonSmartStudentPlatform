import { TrendingDown, TrendingUp } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

const TONE_RING = {
  brand:   'from-brand-500/20 to-brand-500/0 text-brand-600 dark:text-brand-300',
  emerald: 'from-emerald-500/20 to-emerald-500/0 text-emerald-600 dark:text-emerald-300',
  amber:   'from-amber-500/20 to-amber-500/0 text-amber-600 dark:text-amber-300',
  fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/0 text-fuchsia-600 dark:text-fuchsia-300',
  cyan:    'from-cyan-500/20 to-cyan-500/0 text-cyan-600 dark:text-cyan-300',
  rose:    'from-rose-500/20 to-rose-500/0 text-rose-600 dark:text-rose-300',
};

const StatCard = ({ icon: Icon, label, value, delta, tone = 'brand' }) => {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="card p-5 group transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${TONE_RING[tone]}`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      {typeof delta === 'number' && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
              positive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
            }`}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(delta)}%
          </span>
          <span className="text-slate-500 dark:text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
