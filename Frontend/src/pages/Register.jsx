import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import Silk from '../components/backgrounds/Silk';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { isEmail, minLength } from '../utils/validators';
import { APP_NAME, getRoleDashboard } from '../utils/constants';
import BorderGlow from '../components/ui/BorderGlow';

const Register = () => {
  const { isAuthenticated, register, user } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={getRoleDashboard(user?.role)} replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!minLength(form.fullName, 2)) e.fullName = 'Enter your full name';
    if (!isEmail(form.email)) e.email = 'Enter a valid email address';
    if (!minLength(form.password, 6)) e.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const registeredUser = await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      notify('Account created successfully!', { type: 'success' });
      navigate(getRoleDashboard(registeredUser.role), { replace: true });
    } catch (err) {
      notify(err.message || 'Registration failed', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Silk />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-6 flex items-center gap-2.5 justify-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur border border-white/20 text-white">
              <GraduationCap size={20} />
            </span>
            <div className="text-white">
              <p className="text-sm uppercase tracking-[0.2em] opacity-70">Admin Console</p>
              <p className="text-lg font-semibold">{APP_NAME}</p>
            </div>
          </div>

          {/* Glassmorphism card */}
          <BorderGlow
            backgroundColor="rgba(8, 6, 18, 0.72)"
            borderRadius={18}
            glowColor="270 75 72"
            glowRadius={38}
            glowIntensity={0.95}
            coneSpread={22}
            edgeSensitivity={28}
            animated
            colors={['#c084fc', '#a78bfa', '#38bdf8']}
            className="w-full"
          >
          <div className="p-7 text-white">
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="mt-1 text-sm text-white/70">
              Register a new admin account to access the dashboard.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Input
                label={<span className="text-white/80">Full name</span>}
                type="text"
                placeholder="Jane Doe"
                value={form.fullName}
                onChange={set('fullName')}
                leftIcon={User}
                error={errors.fullName}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                autoComplete="name"
              />
              <Input
                label={<span className="text-white/80">Email</span>}
                type="email"
                placeholder="you@campus.edu"
                value={form.email}
                onChange={set('email')}
                leftIcon={Mail}
                error={errors.email}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                autoComplete="email"
              />
              <Input
                label={<span className="text-white/80">Password</span>}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                leftIcon={Lock}
                error={errors.password}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                autoComplete="new-password"
              />
              <Input
                label={<span className="text-white/80">Confirm password</span>}
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={set('confirm')}
                leftIcon={Lock}
                error={errors.confirm}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                autoComplete="new-password"
              />

              <Button type="submit" loading={loading} className="w-full" rightIcon={ShieldCheck}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>

              <p className="text-center text-xs text-white/70">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-white hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
          </BorderGlow>

          <p className="mt-6 text-center text-xs text-white/60">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
