import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-4">
    <div className="rounded-2xl p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
      <Icon size={28} />
    </div>
    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
    {description && (
      <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
