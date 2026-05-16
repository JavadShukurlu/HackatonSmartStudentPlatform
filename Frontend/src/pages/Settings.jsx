import { useState } from 'react';
import { LogOut, Save, ShieldCheck } from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { isEmail, minLength } from '../utils/validators';

const Settings = () => {
  const { user, setUser, logout } = useAuth();
  const { notify } = useToast();

  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [savingPwd, setSavingPwd] = useState(false);

  const onSaveProfile = (e) => {
    e.preventDefault();
    const errs = {};
    if (!profile.fullName.trim()) errs.fullName = 'Required';
    if (!isEmail(profile.email)) errs.email = 'Enter a valid email';
    setProfileErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingProfile(true);
    setTimeout(() => {
      setUser?.((u) => ({ ...(u || {}), ...profile }));
      notify('Profile updated', { type: 'success' });
      setSavingProfile(false);
    }, 500);
  };

  const onChangePwd = (e) => {
    e.preventDefault();
    const errs = {};
    if (!minLength(pwd.current, 6)) errs.current = 'Required';
    if (!minLength(pwd.next, 6)) errs.next = 'At least 6 characters';
    if (pwd.next !== pwd.confirm) errs.confirm = 'Passwords do not match';
    setPwdErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingPwd(true);
    setTimeout(() => {
      notify('Password changed', { type: 'success' });
      setPwd({ current: '', next: '', confirm: '' });
      setSavingPwd(false);
    }, 500);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your profile and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center py-4">
            <Avatar name={user?.fullName || 'Admin'} size="lg" className="!h-16 !w-16 !text-base" />
            <p className="mt-3 text-base font-semibold">{user?.fullName}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="mt-3 badge bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 capitalize">
              {user?.role}
            </span>

            <Button variant="outline" leftIcon={LogOut} onClick={logout} className="mt-6 w-full">
              Sign out
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Profile" subtitle="Update your account information" />
          <form onSubmit={onSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full name"
              value={profile.fullName}
              onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              error={profileErrors.fullName}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              error={profileErrors.email}
            />
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" leftIcon={Save} loading={savingProfile}>Save changes</Button>
            </div>
          </form>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader title="Change password" subtitle="Use a strong, unique password" />
          <form onSubmit={onChangePwd} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Current password"
              type="password"
              value={pwd.current}
              onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
              error={pwdErrors.current}
            />
            <Input
              label="New password"
              type="password"
              value={pwd.next}
              onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
              error={pwdErrors.next}
            />
            <Input
              label="Confirm new password"
              type="password"
              value={pwd.confirm}
              onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
              error={pwdErrors.confirm}
            />
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" leftIcon={ShieldCheck} loading={savingPwd}>Update password</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
