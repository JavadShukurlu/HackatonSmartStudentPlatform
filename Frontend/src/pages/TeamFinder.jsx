import { useEffect, useMemo, useState } from 'react';
import { Eye, Search, Trash2, Users2, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { teamFinderService } from '../api/teamFinderService';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatters';

/** Team Finder page — card grid. Super Admin can delete posts. */
const TeamFinder = () => {
  const { notify } = useToast();
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;

  const [loading, setLoading] = useState(true);
  const [items, setItems]     = useState([]);
  const [search, setSearch]   = useState('');
  const [viewing, setViewing] = useState(null);
  const [confirmDel, setDel]  = useState(null);
  const debounced = useDebounce(search, 250);

  useEffect(() => {
    teamFinderService.list().then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) => t.title.toLowerCase().includes(q) || t.creator.toLowerCase().includes(q) ||
             t.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [items, debounced]);

  const handleDelete = async () => {
    if (!confirmDel) return;
    await teamFinderService.remove(confirmDel.id);
    setItems((prev) => prev.filter((i) => i.id !== confirmDel.id));
    notify('Team post deleted', { type: 'success' });
    setDel(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team Finder</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSuperAdmin ? 'Manage all team finder posts.' : 'Browse team finder posts.'}
        </p>
      </div>

      <div className="max-w-md">
        <Input
          leftIcon={Search}
          placeholder="Search by title, skills or creator…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Users2} title="No team posts found" description="Try adjusting your search." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              isSuperAdmin={isSuperAdmin}
              onView={() => setViewing(team)}
              onDelete={() => setDel(team)}
            />
          ))}
        </div>
      )}

      {/* View modal */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Team details"
        footer={<Button variant="outline" onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Title</p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{viewing.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skills needed</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {viewing.skills.map((s) => (
                  <span key={s} className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">{s}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Creator</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{viewing.creator}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Members</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                  {viewing.membersCount} / {viewing.membersNeeded} joined
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Posted</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{formatDate(viewing.createdAt)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={Boolean(confirmDel)}
        onClose={() => setDel(null)}
        title="Delete team post"
        footer={
          <>
            <Button variant="outline" onClick={() => setDel(null)}>Cancel</Button>
            <Button variant="danger" leftIcon={Trash2} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm">
          Delete <span className="font-semibold">&quot;{confirmDel?.title}&quot;</span>? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

/** Individual Team Finder card */
const TeamCard = ({ team, isSuperAdmin, onView, onDelete }) => (
  <div className="card p-5 flex flex-col gap-3 group hover:-translate-y-0.5 hover:shadow-glow transition-all">
    <div className="flex items-start justify-between gap-2">
      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">{team.title}</p>
      {isSuperAdmin && (
        <button
          onClick={onDelete}
          className="shrink-0 rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
          title="Delete"
        >
          <X size={15} />
        </button>
      )}
    </div>

    <div className="flex flex-wrap gap-1.5">
      {team.skills.map((s) => (
        <span key={s} className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 text-[11px]">{s}</span>
      ))}
    </div>

    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <span>{formatDate(team.createdAt)}</span>
      <span className="flex items-center gap-1">
        <Users2 size={13} />
        {team.membersCount}/{team.membersNeeded} members
      </span>
    </div>

    <p className="text-xs text-slate-400 dark:text-slate-500">by {team.creator}</p>

    <Button size="sm" variant="outline" leftIcon={Eye} onClick={onView}>View</Button>
  </div>
);

export default TeamFinder;
