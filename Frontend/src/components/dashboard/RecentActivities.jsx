import Avatar from '../ui/Avatar';
import EmptyState from '../ui/EmptyState';
import { formatDateTime } from '../../utils/formatters';

const RecentActivities = ({ items = [] }) => {
  if (!items.length) return <EmptyState title="No recent activity" />;
  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
      {items.map((a) => (
        <li key={a.id} className="flex items-center gap-3 py-3">
          <Avatar name={a.user} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
              <span className="font-medium">{a.user}</span> {a.action}{' '}
              <span className="font-medium">{a.target}</span>
            </p>
            <p className="text-xs text-slate-400">{formatDateTime(a.at)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RecentActivities;
