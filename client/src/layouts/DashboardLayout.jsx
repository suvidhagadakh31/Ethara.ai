/**
 * Main dashboard layout with sidebar and navbar.
 */
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950 relative">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.04]" style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.03]" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full blur-[120px] opacity-[0.02]" style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
