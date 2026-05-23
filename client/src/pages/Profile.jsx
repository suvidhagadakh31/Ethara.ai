import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { RoleBadge } from '../components/Badge';
import { formatDate } from '../utils/helpers';
import { HiOutlineMail, HiOutlineShieldCheck, HiOutlineCalendar, HiOutlineLogout } from 'react-icons/hi';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white animate-slide-in">Profile</h1>

      {/* Profile card with gradient header */}
      <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="h-28 relative" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.25) 0%, rgba(245,158,11,0.15) 50%, rgba(244,63,94,0.1) 100%)' }}>
          <div className="absolute inset-0 dot-pattern opacity-20" />
          {/* Floating particles */}
          <div className="absolute top-4 right-8 w-2 h-2 rounded-full bg-brand-400/40 animate-float" />
          <div className="absolute top-8 right-20 w-1.5 h-1.5 rounded-full bg-accent-400/40 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="px-8 pb-8 -mt-10 relative">
          <Avatar name={user?.name} size="lg" className="w-20 h-20 text-2xl border-4 border-surface-900 shadow-glow-sm" />
          <h2 className="text-xl font-bold text-white mt-4">{user?.name}</h2>
          <p className="text-surface-400 text-sm mt-1">{user?.email}</p>
          <div className="mt-2"><RoleBadge role={user?.role} /></div>
        </div>
      </div>

      <div className="card divide-y divide-surface-700/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-5 flex items-center gap-4 group hover:bg-surface-800/20 transition-all duration-300">
          <div className="p-2.5 rounded-xl text-brand-400 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(245,158,11,0.08) 100%)' }}>
            <HiOutlineMail className="text-lg" />
          </div>
          <div><p className="text-xs text-surface-500">Email</p><p className="text-sm text-white">{user?.email}</p></div>
        </div>
        <div className="p-5 flex items-center gap-4 group hover:bg-surface-800/20 transition-all duration-300">
          <div className="p-2.5 rounded-xl text-accent-400 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(234,88,12,0.08) 100%)' }}>
            <HiOutlineShieldCheck className="text-lg" />
          </div>
          <div><p className="text-xs text-surface-500">Role</p><p className="text-sm text-white capitalize">{user?.role}</p></div>
        </div>
        <div className="p-5 flex items-center gap-4 group hover:bg-surface-800/20 transition-all duration-300">
          <div className="p-2.5 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)' }}>
            <HiOutlineCalendar className="text-lg" />
          </div>
          <div><p className="text-xs text-surface-500">Member Since</p><p className="text-sm text-white">{formatDate(user?.createdAt || new Date())}</p></div>
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <button onClick={logout} className="btn-danger w-full flex items-center justify-center gap-2">
          <HiOutlineLogout /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
