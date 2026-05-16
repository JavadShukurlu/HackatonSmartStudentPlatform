import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Search, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { eventsService } from '../api/eventsService';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const STATUS_OPTIONS = [
  { value: 'all',       label: 'All statuses' },
  { value: 'upcoming',  label: 'Upcoming'     },
  { value: 'ongoing',   label: 'Ongoing'      },
  { value: 'completed', label: 'Completed'    },
  { value: 'cancelled', label: 'Cancelled'    },
];

const STATUS_BADGE = {
  upcoming:  'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  ongoing:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  completed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

/** Events management page — Super Admin can edit/delete, Admin can only view. */
const Events = () => {
  const { notify } = useToast();
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;

  const [loading, setLoading]   = useState(true);
  const [items, setItems]       = useState([]);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [viewing, setViewing]   = useState(null);
  const [editing, setEditing]   = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', status: 'upcoming' });
  const [confirmDel, setDel]    = useState(null);
  const debounced = useDebounce(search, 250);

  useEffect(() => {
    eventsService.list().then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return items.filter((e) => {
      const matchQ = !q || e.title.toLowerCase().includes(q);
      const matchS = statusFilter === 'all' || e.status === statusFilter;
      return matchQ && matchS;
    });
  }, [items, debounced, statusFilter]);

  const openEdit = (e) => {
    setEditForm({ title: e.title, description: e.description, date: e.date?.slice(0, 10) ?? '', status: e.status });
    setEditing(e);
  };

  const handleEditSave = async () => {
    if (!editing) return;
    await eventsService.update(editing.id, editForm);
    setItems((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...editForm } : x)));
    notify('Event updated', { type: 'success' });
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    await eventsService.remove(confirmDel.id);
    setItems((prev) => prev.filter((e) => e.id !== confirmDel.id));
    notify('Event deleted', { type: 'success' });
    setDel(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Events</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isSuperAdmin ? 'Manage all campus events.' : 'View all campus events.'}
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input
              leftIcon={Search}
              placeholder="Search events…"
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
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j}><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="No events found" description="Try adjusting your search or filter." />
                  </td>
                </tr>
              ) : (
                filtered.map((ev) => (
                  <tr key={ev.id}>
                    <td className="font-medium text-slate-800 dark:text-slate-100">{ev.title}</td>
                    <td className="text-slate-500 dark:text-slate-400 max-w-[260px] truncate">{ev.description}</td>
                    <td className="text-slate-500 dark:text-slate-400">{formatDate(ev.date)}</td>
                    <td>
                      <span className={`badge capitalize ${STATUS_BADGE[ev.status] ?? ''}`}>{ev.status}</span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1 pr-3">
                        <button
                          onClick={() => setViewing(ev)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        {isSuperAdmin && (
                          <>
                            <button
                              onClick={() => openEdit(ev)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setDel(ev)}
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
        title="Event details"
        footer={<Button variant="outline" onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && (
          <div className="space-y-3">
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
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Date</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{formatDate(viewing.date)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</p>
                <span className={`badge capitalize mt-1 ${STATUS_BADGE[viewing.status] ?? ''}`}>{viewing.status}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit event"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button leftIcon={Pencil} onClick={handleEditSave}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">Title</label>
            <input
              className="input-base"
              value={editForm.title}
              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">Description</label>
            <textarea
              className="input-base resize-none"
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">Date</label>
              <input
                type="date"
                className="input-base"
                value={editForm.date}
                onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <Select
              label="Status"
              value={editForm.status}
              onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
              options={STATUS_OPTIONS.slice(1)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={Boolean(confirmDel)}
        onClose={() => setDel(null)}
        title="Delete event"
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

export default Events;
