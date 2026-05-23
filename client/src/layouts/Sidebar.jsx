import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineViewGrid, HiOutlineFolder, HiOutlineClipboardList, HiOutlineUserGroup, HiOutlineUser, HiOutlineX } from 'react-icons/hi';
import { HiSparkles } from 'react-icons/hi2';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid, roles: ['admin', 'member'] },
    { to: '/projects', label: 'Projects', icon: HiOutlineFolder, roles: ['admin', 'member'] },
    { to: '/tasks', label: 'Tasks', icon: HiOutlineClipboardList, roles: ['admin', 'member'] },
    { to: '/team', label: 'Team', icon: HiOutlineUserGroup, roles: ['admin'] },
    { to: '/profile', label: 'Profile', icon: HiOutlineUser, roles: ['admin', 'member'] },
  ];

  const visibleLinks = links.filter(l => l.roles.includes(user?.role));

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-500 ease-bounce-in ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-surface-950/98 backdrop-blur-2xl border-r border-surface-700/15" />
      {/* Top warm glow */}
      <div className="absolute top-0 left-0 w-full h-48 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, rgba(244,63,94,0.06), transparent 70%)' }} />

      <div className="relative flex flex-col h-full">
        {/* Brand */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-glow-sm transition-all duration-500 group-hover:shadow-glow group-hover:scale-105" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)' }}>
                <HiSparkles className="text-white text-lg" />
              </div>
              <div className="absolute -inset-1 rounded-xl opacity-30 blur-md animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)' }} />
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text">TaskFlow</h1>
              <p className="text-[10px] text-surface-500 uppercase tracking-[0.2em]">Pro Edition</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5" aria-label="Close sidebar">
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 gradient-line" />

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-surface-600 font-semibold px-4 pb-3">Menu</p>
          {visibleLinks.map(({ to, label, icon: Icon }, idx) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative stagger-${idx + 1} ${
                  isActive
                    ? 'text-white'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(245,158,11,0.06) 100%)', border: '1px solid rgba(244, 63, 94, 0.2)' }} />
                  )}
                  <div className={`relative z-10 flex items-center gap-3 ${isActive ? 'text-white' : ''}`}>
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? 'text-brand-400' : 'group-hover:bg-surface-700/50 group-hover:text-brand-400'}`}>
                      <Icon className="text-lg" />
                    </div>
                    <span>{label}</span>
                  </div>
                  {isActive && (
                    <div className="absolute right-3 w-2 h-2 rounded-full z-10 animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #f43f5e, #f59e0b)' }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4">
          <div className="relative overflow-hidden px-4 py-4 rounded-xl border border-surface-700/15 group hover:border-brand-500/20 transition-all duration-500">
            <div className="absolute inset-0 opacity-50" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.04) 0%, rgba(245,158,11,0.03) 100%)' }} />
            <div className="relative flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-brand-300 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(245,158,11,0.15) 100%)' }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-surface-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-surface-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
