import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Eye, Search, Trash2, XCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { announcementsService } from '../api/announcementsService';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const STATUS_OPTIONS = [
  { value: 'all',      label: 'All statuses' },
  { value: 'pending',  label: 'Pending'       },
  { value: 'approved', label: 'Approved'      },
  { value: 'rejected', label: 'Rejected'      },
];

const STATUS_BADGE = {
  pending:  'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

/** Announcements management page — Super Admin can approve/reject/delete, Admin can only view. */
const Announcements = () => {
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
    announcementsService.list().then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return items.filter((a) => {
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      const matchS = statusFilter === 'all' || a.status === statusFilter;
      return matchQ && matchS;
    });
  }, [items, debounced, statusFilter]);

  const handleStatus = async (id, status) => {
    await announcementsService.updateStatus(id, status);
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    notify(`Announcement ${status}`, { type: 'success' });
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    await announcementsService.remove(confirmDel.id);
    setItems((prev) => prev.filter((a) => a.id !== confirmDel.id));
    notify('Announcement deleted', { type: 'success' });
    setDel(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Announcements</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSuperAdmin ? 'Review and moderate all announcements.' : 'View all announcements.'}
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input
              leftIcon={Search}
              placeholder="Search by title or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select value={statusFilter} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} />
          </div>
        </div>

        <div className="mt-4 table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Created</th>
                <th>Status</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j}><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState title="No announcements found" description="Try adjusting your search or filter." />
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="font-medium text-slate-800 dark:text-slate-100 max-w-[220px] truncate">
                      {a.title}
                    </td>
                    <td>
                      <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        {a.category}
                      </span>
                    </td>
                    <td className="text-slate-500 dark:text-slate-400">{a.author}</td>
                    <td className="text-slate-500 dark:text-slate-400">{formatDate(a.createdAt)}</td>
                    <td>
                      <span className={`badge capitalize ${STATUS_BADGE[a.status] ?? ''}`}>{a.status}</span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1 pr-3">
                        <button
                          onClick={() => setViewing(a)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        {isSuperAdmin && (
                          <>
                            {a.status !== 'approved' && (
                              <button
                                onClick={() => handleStatus(a.id, 'approved')}
                                className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition"
                                title="Approve"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            {a.status !== 'rejected' && (
                              <button
                                onClick={() => handleStatus(a.id, 'rejected')}
                                className="rounded-lg p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition"
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => setDel(a)}
                              className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View modal */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Announcement details"
        footer={<Button variant="outline" onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Title</p>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{viewing.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{viewing.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</p>
                <span className={`badge capitalize mt-1 ${STATUS_BADGE[viewing.status] ?? ''}`}>{viewing.status}</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Author</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{viewing.author}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Created</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{formatDate(viewing.createdAt)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={Boolean(confirmDel)}
        onClose={() => setDel(null)}
        title="Delete announcement"
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

export default Announcements;
