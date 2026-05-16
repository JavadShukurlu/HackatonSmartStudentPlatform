import { useEffect, useMemo, useState } from 'react';
import { PackageSearch, Search, Trash2, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { lostFoundService } from '../api/lostFoundService';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const STATUS_OPTIONS = [
  { value: 'all',   label: 'All'   },
  { value: 'lost',  label: 'Lost'  },
  { value: 'found', label: 'Found' },
];

/** Lost & Found page — card grid view with status filter. Super Admin can delete. */
const LostFound = () => {
  const { notify } = useToast();
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;

  const [loading, setLoading]     = useState(true);
  const [items, setItems]         = useState([]);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [viewing, setViewing]     = useState(null);
  const [confirmDel, setDel]      = useState(null);
  const debounced = useDebounce(search, 250);

  useEffect(() => {
    lostFoundService.list().then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return items.filter((i) => {
      const matchQ = !q || i.title.toLowerCase().includes(q) || i.contact.toLowerCase().includes(q);
      const matchS = statusFilter === 'all' || i.status === statusFilter;
      return matchQ && matchS;
    });
  }, [items, debounced, statusFilter]);

  const handleDelete = async () => {
    if (!confirmDel) return;
    await lostFoundService.remove(confirmDel.id);
    setItems((prev) => prev.filter((i) => i.id !== confirmDel.id));
    notify('Post deleted', { type: 'success' });
    setDel(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Lost &amp; Found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSuperAdmin ? 'Manage all lost and found posts.' : 'Browse lost and found posts.'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <Input
            leftIcon={Search}
            placeholder="Search by title or contact…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Select value={statusFilter} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} />
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={PackageSearch} title="No posts found" description="Try changing the filter or search term." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <LostFoundCard
              key={item.id}
              item={item}
              isSuperAdmin={isSuperAdmin}
              onView={() => setViewing(item)}
              onDelete={() => setDel(item)}
            />
          ))}
        </div>
      )}

      {/* Details modal */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Post details"
        footer={<Button variant="outline" onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`badge capitalize ${
                viewing.status === 'lost'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
              }`}>
                {viewing.status}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Title</p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{viewing.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{viewing.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contact</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{viewing.contact}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Date</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{formatDate(viewing.date)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={Boolean(confirmDel)}
        onClose={() => setDel(null)}
        title="Delete post"
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

/** Individual Lost & Found card component */
const LostFoundCard = ({ item, isSuperAdmin, onView, onDelete }) => (
  <div className="card p-0 overflow-hidden group hover:-translate-y-0.5 hover:shadow-glow transition-all">
    {/* Image placeholder */}
    <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
      <PackageSearch size={40} className="text-slate-300 dark:text-slate-600" />
    </div>

    <div className="p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight line-clamp-2">
          {item.title}
        </p>
        <span className={`badge shrink-0 capitalize ${
          item.status === 'lost'
            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
        }`}>
          {item.status}
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.contact}</p>
      <p className="text-xs text-slate-400">{formatDate(item.date)}</p>

      <div className="flex items-center gap-2 pt-1">
        <Button size="sm" variant="outline" onClick={onView} className="flex-1">Details</Button>
        {isSuperAdmin && (
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
            title="Delete"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default LostFound;
