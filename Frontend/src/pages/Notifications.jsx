import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, Plus, Search, Send } from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Select from '../components/ui/Select';
import { notificationsService } from '../api/notificationsService';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { formatDateTime } from '../utils/formatters';
import { required } from '../utils/validators';

const TYPE_OPTIONS = [
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
];

const Notifications = () => {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    notificationsService.list().then((list) => {
      setItems(list);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
    );
  }, [items, debounced]);

  const markRead = async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    notificationsService.markRead(id).catch(() => {});
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const onSend = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!required(form.title)) errs.title = 'Title is required';
    if (!required(form.message)) errs.message = 'Message is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const created = await notificationsService.send(form);
      setItems((prev) => [created, ...prev]);
      notify('Notification sent', { type: 'success' });
      setOpen(false);
      setForm({ title: '', message: '', type: 'info' });
    } catch (err) {
      notify(err.message, { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={CheckCheck} onClick={markAllRead}>
            Mark all read
          </Button>
          <Button leftIcon={Plus} onClick={() => setOpen(true)}>Send notification</Button>
        </div>
      </div>

      <Card>
        <div className="max-w-sm">
          <Input
            leftIcon={Search}
            placeholder="Search notifications…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You will see notifications here when they arrive."
            />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 py-4 px-2 -mx-2 rounded-xl transition cursor-pointer
                    ${!n.read ? 'bg-brand-50/40 dark:bg-brand-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                  onClick={() => !n.read && markRead(n.id)}
                >
                  <span
                    className={`mt-1 h-2 w-2 rounded-full ${
                      !n.read ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                        {n.title}
                      </p>
                      <Badge tone={n.type === 'warning' ? 'warning' : n.type === 'success' ? 'success' : 'info'}>
                        {n.type}
                      </Badge>
                      {!n.read && <Badge tone="danger">New</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 truncate">{n.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Send notification"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button leftIcon={Send} loading={submitting} onClick={onSend}>Send</Button>
          </>
        }
      >
        <form onSubmit={onSend} className="space-y-3">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            error={errors.title}
          />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={4}
              className="input-base resize-none"
              placeholder="Write something concise and clear…"
            />
            {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
          </div>
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            options={TYPE_OPTIONS}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Notifications;
