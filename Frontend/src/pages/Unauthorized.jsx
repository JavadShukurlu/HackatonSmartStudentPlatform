import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { getRoleDashboard } from '../utils/constants';

/** Unauthorized page — shown when a user tries to access a restricted route. */
const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleBack = () => {
    if (isAuthenticated && user) {
      navigate(getRoleDashboard(user.role), { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-rose-100 dark:bg-rose-500/15">
          <ShieldOff size={36} className="text-rose-600 dark:text-rose-400" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Access Denied</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <Button onClick={handleBack} className="mx-auto">
          Go Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
