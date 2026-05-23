import { useState, useEffect } from 'react';
import authService from '../services/authService';
import Avatar from '../components/Avatar';
import { RoleBadge } from '../components/Badge';
import { RowSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/helpers';
import { HiOutlineUserGroup, HiOutlineMail, HiOutlineSearch } from 'react-icons/hi';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    authService.getUsers().then(r => setUsers(r.data.users)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="space-y-6"><div className="skeleton h-8 w-32 rounded" /><div className="space-y-3">{[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}</div></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-white">Team Members</h1><p className="text-surface-400 text-sm mt-1">{users.length} member{users.length !== 1 ? 's' : ''}</p></div>

      <div className="card p-4">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input pl-10" placeholder="Search members..." aria-label="Search members" />
        </div>
      </div>

      {!filtered.length ? <EmptyState icon={HiOutlineUserGroup} title="No members found" description="Try a different search." /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(u => (
            <div key={u._id} className="card-glow p-5 flex items-center gap-4 group">
              <Avatar name={u.name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate">{u.name}</h3>
                  <RoleBadge role={u.role} />
                </div>
                <p className="text-xs text-surface-500 flex items-center gap-1 mt-1 truncate"><HiOutlineMail />{u.email}</p>
                <p className="text-[10px] text-surface-600 mt-1">Joined {formatDate(u.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
