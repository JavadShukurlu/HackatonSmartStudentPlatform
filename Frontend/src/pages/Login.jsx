import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ShieldCheck } from 'lucide-react';
import Silk from '../components/backgrounds/Silk';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { isEmail, minLength } from '../utils/validators';
import { APP_NAME, getRoleDashboard } from '../utils/constants';
import BorderGlow from '../components/ui/BorderGlow';

const Login = () => {
  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();

  const [form, setForm] = useState({ email: '', password: '' });

  const quickFill = (role) => {
    if (role === 'superadmin') setForm({ email: 'superadmin@example.com', password: '123456' });
    else setForm({ email: 'admin@example.com', password: '123456' });
    setErrors({});
  };
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={getRoleDashboard(user?.role)} replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!isEmail(form.email)) e.email = 'Enter a valid email address';
    if (!minLength(form.password, 6)) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const loggedUser = await login(form);
      notify('Welcome back!', { type: 'success' });
      navigate(getRoleDashboard(loggedUser.role), { replace: true });
    } catch (err) {
      notify(err.message || 'Login failed', { type: 'error' });
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
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p className="mt-1 text-sm text-white/70">
              Enter your credentials to access the dashboard.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between text-xs text-white/70">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-brand-500" defaultChecked /> Remember me
                </label>
                <a href="#" className="hover:text-white">Forgot password?</a>
              </div>

              <Button type="submit" loading={loading} className="w-full" rightIcon={ShieldCheck}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>

              <div className="rounded-xl border border-white/15 bg-white/5 p-3 space-y-2">
                <p className="text-center text-[11px] text-white/50 uppercase tracking-wider">Demo accounts</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickFill('superadmin')}
                    className="flex flex-col items-start rounded-lg border border-violet-400/40 bg-violet-500/20 px-3 py-2 text-left hover:bg-violet-500/30 transition"
                  >
                    <span className="text-[10px] font-semibold text-violet-300 uppercase tracking-wide">Super Admin</span>
                    <span className="text-[11px] font-mono text-white/70 truncate w-full">superadmin@example.com</span>
                    <span className="text-[11px] font-mono text-white/50">123456</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFill('admin')}
                    className="flex flex-col items-start rounded-lg border border-teal-400/40 bg-teal-500/20 px-3 py-2 text-left hover:bg-teal-500/30 transition"
                  >
                    <span className="text-[10px] font-semibold text-teal-300 uppercase tracking-wide">Admin</span>
                    <span className="text-[11px] font-mono text-white/70 truncate w-full">admin@example.com</span>
                    <span className="text-[11px] font-mono text-white/50">123456</span>
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-white/70">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-medium text-white hover:underline">
                  Create one
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

export default Login;
