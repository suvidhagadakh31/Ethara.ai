import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/Badge';
import Avatar from '../components/Avatar';
import { HiOutlineLogout, HiOutlineMenu, HiOutlineBell, HiOutlineSearch } from 'react-icons/hi';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="relative bg-surface-950/70 backdrop-blur-2xl border-b border-surface-700/15 px-4 md:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 gradient-line" />

      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden btn-ghost p-2" aria-label="Open menu">
          <HiOutlineMenu className="text-xl" />
        </button>
        <div className="hidden md:block animate-fade-in">
          <h2 className="text-base font-semibold text-white">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h2>
          <p className="text-xs text-surface-500">Let's build something great today</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="btn-ghost p-2.5 hidden sm:flex hover:scale-105 transition-transform duration-300" aria-label="Search">
          <HiOutlineSearch className="text-lg" />
        </button>

        {/* Notifications */}
        <button className="btn-ghost p-2.5 relative group" aria-label="Notifications">
          <HiOutlineBell className="text-lg group-hover:animate-wiggle" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border-2 border-surface-950 animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #f43f5e, #f59e0b)' }} />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-surface-700/20 bg-surface-800/30 backdrop-blur-sm hover:border-brand-500/20 transition-all duration-300">
          <Avatar name={user?.name} size="sm" />
          <span className="text-sm text-surface-200 hidden sm:inline font-medium">{user?.name}</span>
          <RoleBadge role={user?.role} />
        </div>

        {/* Logout */}
        <button onClick={logout} className="p-2.5 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:rotate-6" aria-label="Logout" title="Logout">
          <HiOutlineLogout className="text-lg" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
