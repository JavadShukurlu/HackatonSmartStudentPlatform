import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { formatDate } from '../../utils/formatters';

const LatestStudents = ({ items = [] }) => {
  if (!items.length) return <EmptyState title="No students yet" />;
  return (
    <ul className="space-y-3">
      {items.map((s) => (
        <li
          key={s.id}
          className="flex items-center gap-3 rounded-xl p-2 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
        >
          <Avatar name={s.fullName} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-100 truncate">{s.fullName}</p>
            <p className="text-xs text-slate-400 truncate">{s.email}</p>
          </div>
          <div className="text-right">
            <Badge tone="success">Student</Badge>
            <p className="mt-1 text-[11px] text-slate-400">{formatDate(s.createdAt)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LatestStudents;
