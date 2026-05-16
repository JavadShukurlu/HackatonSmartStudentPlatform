import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Silk from '../components/backgrounds/Silk';
import RouteTransition from '../components/layout/RouteTransition';

const COLLAPSE_KEY = 'admin.sidebar.collapsed';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <div className="relative min-h-screen flex">
      {/* Silk background — same as Login/Register */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      >
        <Silk />
      </div>

      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onCollapseToggle={toggleCollapsed}
          collapsed={collapsed}
        />
        <main className="flex-1 p-4 lg:p-6">
          <RouteTransition />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
