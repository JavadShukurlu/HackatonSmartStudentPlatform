import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Silk from '../components/backgrounds/Silk';

const NotFound = () => (
  <div className="relative min-h-screen overflow-hidden">
    <Silk />
    <div className="relative z-10 flex min-h-screen items-center justify-center p-6 text-center">
      <div className="max-w-md text-white animate-fade-in">
        <p className="text-6xl font-extrabold tracking-tight">404</p>
        <p className="mt-2 text-lg font-medium">Page not found</p>
        <p className="mt-1 text-sm text-white/70">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/admin/dashboard" className="inline-block mt-6">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
