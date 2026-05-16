import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Search, Trash2, UserPlus, Ban, ShieldOff } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { usersService } from '../api/usersService';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../hooks/useAuth';
import { ROLES, ROLE_BADGE_CLASS, PAGE_SIZE_DEFAULT } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const ROLE_OPTIONS = [
  { value: 'all',               label: 'All roles' },
  { value: ROLES.SUPER_ADMIN,   label: 'Super Admin' },
  { value: ROLES.ADMIN,         label: 'Admin' },
  { value: ROLES.TEACHER,       label: 'Teacher' },
  { value: ROLES.STUDENT,       label: 'Student' },
];

const Users = () => {
  const { notify } = useToast();
  const { user: currentUser } = useAuth();

  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;

  const canEdit   = (target) => isSuperAdmin && target.id !== currentUser.id;
  const canDelete = (target) => isSuperAdmin && target.id !== currentUser.id;
  // SuperAdmin: block anyone except self. Admin: block only students/teachers (not admins/superadmin or self).
  const canBlock  = (target) =>
    target.id !== currentUser.id &&
    (isSuperAdmin || (target.role === ROLES.STUDENT || target.role === ROLES.TEACHER));
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 250);

  const [viewing, setViewing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmBlock, setConfirmBlock] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', role: ROLES.STUDENT, status: 'active', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await usersService.list();
      setItems(list);
    } catch (e) {
      notify(e.message, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return items.filter((u) => {
      const matchesQ = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesR = role === 'all' || u.role === role;
      return matchesQ && matchesR;
    });
  }, [items, debounced, role]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE_DEFAULT));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE_DEFAULT, safePage * PAGE_SIZE_DEFAULT);

  useEffect(() => { setPage(1); }, [debounced, role]);

  const openCreate = () => {
    setForm({ fullName: '', email: '', role: ROLES.STUDENT, status: 'active', password: '' });
    setFormErrors({});
    setCreating(true);
  };

  const openEdit = (u) => {
    setForm({
      fullName: u.fullName || '',
      email: u.email || '',
      role: u.role || ROLES.STUDENT,
      status: u.status || 'active',
      password: '',
    });
    setFormErrors({});
    setEditing(u);
  };

  const validate = (isEdit) => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!isEdit && !form.password) errs.password = 'Password is required';
    if (form.password && form.password.length < 6) errs.password = 'At least 6 characters';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onCreateSubmit = async () => {
    if (!validate(false)) return;
    setSaving(true);
    try {
      const created = await usersService.create({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role,
        status: form.status,
        password: form.password,
      });
      setItems((prev) => [created, ...prev]);
      notify('User created', { type: 'success' });
      setCreating(false);
    } catch (e) {
      notify(e.message, { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const onEditSubmit = async () => {
    if (!editing) return;
    if (!validate(true)) return;
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role,
        status: form.status,
      };
      if (form.password) payload.password = form.password;
      const updated = await usersService.update(editing.id, payload);
      setItems((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...updated } : x)));
      notify('User updated', { type: 'success' });
      setEditing(null);
    } catch (e) {
      notify(e.message, { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    const u = confirmDelete;
    if (!u) return;
    try {
      await usersService.remove(u.id);
      setItems((prev) => prev.filter((x) => x.id !== u.id));
      notify('User deleted', { type: 'success' });
    } catch (e) {
      notify(e.message, { type: 'error' });
    } finally {
      setConfirmDelete(null);
    }
  };

  const onBlock = () => {
    const u = confirmBlock;
    if (!u) return;
    const nextStatus = u.status === 'blocked' ? 'active' : 'blocked';
    setItems((prev) => prev.map((x) => x.id === u.id ? { ...x, status: nextStatus } : x));
    notify(`User ${nextStatus === 'blocked' ? 'blocked' : 'unblocked'}`, { type: 'success' });
    setConfirmBlock(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isSuperAdmin ? 'Manage admins, teachers and students.' : 'View all users in the system.'}
          </p>
        </div>
        {isSuperAdmin && (
          <Button leftIcon={UserPlus} onClick={openCreate}>Add user</Button>
        )}
      </div>

      {/* Read-only notice for admin
      {!isSuperAdmin && ( */}
        {/* // <div className="flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
        //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        //   You have <strong className="mx-1">view-only</strong> access. Contact a Super Admin to make changes.
        // </div>
      // )} */}

      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input
              leftIcon={Search}
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select value={role} onChange={(e) => setRole(e.target.value)} options={ROLE_OPTIONS} />
          </div>
        </div>

        <div className="mt-4 table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Full name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j}><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState title="No users found" description="Try changing search or filter." />
                  </td>
                </tr>
              ) : (
                paged.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={u.fullName} />
                        <span className="font-medium text-slate-800 dark:text-slate-100">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td>
                      <span className={`badge capitalize ${ROLE_BADGE_CLASS[u.role]}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`badge capitalize ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : u.status === 'blocked'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {u.status ?? 'active'}
                      </span>
                    </td>
                    <td className="text-slate-500 dark:text-slate-400">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1 pr-3">
                        {isSuperAdmin ? (
                          <>
                            <button
                              onClick={() => setViewing(u)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            {canEdit(u) && (
                              <button
                                onClick={() => openEdit(u)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                            {canDelete(u) && (
                              <button
                                onClick={() => setConfirmDelete(u)}
                                className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            {canBlock(u) && (
                              <button
                                onClick={() => setConfirmBlock(u)}
                                className={`rounded-lg p-2 transition ${
                                  u.status === 'blocked'
                                    ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                    : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                }`}
                                title={u.status === 'blocked' ? 'Unblock' : 'Block'}
                              >
                                {u.status === 'blocked' ? <ShieldOff size={16} /> : <Ban size={16} />}
                              </button>
                            )}
                          </>
                        ) : (
                          /* Admin: view + block for students/teachers; permission denied badge for admins */
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewing(u)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            {canBlock(u) ? (
                              <button
                                onClick={() => setConfirmBlock(u)}
                                className={`rounded-lg p-2 transition ${
                                  u.status === 'blocked'
                                    ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                    : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                }`}
                                title={u.status === 'blocked' ? 'Unblock' : 'Block'}
                              >
                                {u.status === 'blocked' ? <ShieldOff size={16} /> : <Ban size={16} />}
                              </button>
                            ) : (
                              <span className="badge text-[10px] bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
                                Permission Denied
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
      </Card>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="User details"
        footer={<Button variant="outline" onClick={() => setViewing(null)}>Close</Button>}
      >
        {viewing && (
          <div className="flex items-center gap-4">
            <Avatar name={viewing.fullName} size="lg" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{viewing.fullName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{viewing.email}</p>
              <span className={`badge capitalize mt-1 ${ROLE_BADGE_CLASS[viewing.role]}`}>{viewing.role}</span>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={creating}
        onClose={() => !saving && setCreating(false)}
        title="Add user"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreating(false)} disabled={saving}>Cancel</Button>
            <Button leftIcon={UserPlus} onClick={onCreateSubmit} disabled={saving}>
              {saving ? 'Saving…' : 'Create user'}
            </Button>
          </>
        }
      >
        <UserForm form={form} setForm={setForm} errors={formErrors} isEdit={false} currentUser={currentUser} />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => !saving && setEditing(null)}
        title="Edit user"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
            <Button leftIcon={Pencil} onClick={onEditSubmit} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      >
        <UserForm form={form} setForm={setForm} errors={formErrors} isEdit currentUser={currentUser} />
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete user"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" leftIcon={Trash2} onClick={onDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm">
          Are you sure you want to delete <span className="font-semibold">{confirmDelete?.fullName}</span>?
          This action cannot be undone.
        </p>
      </Modal>

      <Modal
        open={Boolean(confirmBlock)}
        onClose={() => setConfirmBlock(null)}
        title={confirmBlock?.status === 'blocked' ? 'Unblock user' : 'Block user'}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmBlock(null)}>Cancel</Button>
            <Button
              variant={confirmBlock?.status === 'blocked' ? 'primary' : 'danger'}
              leftIcon={confirmBlock?.status === 'blocked' ? ShieldOff : Ban}
              onClick={onBlock}
            >
              {confirmBlock?.status === 'blocked' ? 'Unblock' : 'Block'}
            </Button>
          </>
        }
      >
        <p className="text-sm">
          {confirmBlock?.status === 'blocked'
            ? <>Unblock <span className="font-semibold">{confirmBlock?.fullName}</span>? They will regain access to the platform.</>
            : <>Block <span className="font-semibold">{confirmBlock?.fullName}</span>? They will lose access until unblocked.</>}
        </p>
      </Modal>
    </div>
  );
};

const UserForm = ({ form, setForm, errors, isEdit, currentUser }) => {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;
  const roleOptions = [
    ...(isSuperAdmin ? [{ value: ROLES.SUPER_ADMIN, label: 'Super Admin' }] : []),
    { value: ROLES.ADMIN, label: 'Admin' },
    { value: ROLES.TEACHER, label: 'Teacher' },
    { value: ROLES.STUDENT, label: 'Student' },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input
          label="Full name"
          placeholder="Jane Doe"
          value={form.fullName}
          onChange={set('fullName')}
          error={errors.fullName}
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          label="Email"
          type="email"
          placeholder="jane@campus.edu"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
      </div>
      <Select
        label="Role"
        value={form.role}
        onChange={set('role')}
        options={roleOptions}
      />
      <Select
        label="Status"
        value={form.status}
        onChange={set('status')}
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
      />
      <div className="sm:col-span-2">
        <Input
          label={isEdit ? 'New password (optional)' : 'Password'}
          type="password"
          placeholder={isEdit ? 'Leave blank to keep current' : 'Min 6 characters'}
          value={form.password}
          onChange={set('password')}
          error={errors.password}
        />
      </div>
    </div>
  );
};

export default Users;
