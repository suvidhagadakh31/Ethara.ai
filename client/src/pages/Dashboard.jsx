import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import { StatCardSkeleton } from '../components/Skeleton';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { formatDate, isOverdue } from '../utils/helpers';
import { HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamation, HiOutlineFolder, HiOutlineTrendingUp, HiOutlineArrowRight, HiOutlineLightningBolt } from 'react-icons/hi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then(res => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-40 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
    </div>
  );

  const { stats, tasksPerProject, tasksPerUser, myTasks, recentActivity } = data || {};

  const statCards = [
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: HiOutlineClipboardList, gradient: 'from-blue-500 to-indigo-600', link: '/tasks' },
    { label: 'Completed', value: stats?.completedTasks || 0, icon: HiOutlineCheckCircle, gradient: 'from-emerald-500 to-teal-600', link: '/tasks?status=completed' },
    { label: 'In Progress', value: stats?.inProgressTasks || 0, icon: HiOutlineClock, gradient: 'from-brand-500 to-brand-700', link: '/tasks?status=in-progress' },
    { label: 'Overdue', value: stats?.overdueTasks || 0, icon: HiOutlineExclamation, gradient: 'from-red-500 to-rose-700', link: '/tasks?status=overdue' },
    { label: 'Projects', value: stats?.totalProjects || 0, icon: HiOutlineFolder, gradient: 'from-violet-500 to-purple-700', link: '/projects' },
    { label: 'Completion', value: `${stats?.completionRate || 0}%`, icon: HiOutlineTrendingUp, gradient: 'from-accent-500 to-orange-600', link: '/tasks' },
  ];

  const pieData = [
    { name: 'To Do', value: stats?.pendingTasks || 0, color: '#71717a' },
    { name: 'In Progress', value: stats?.inProgressTasks || 0, color: '#f43f5e' },
    { name: 'Review', value: stats?.reviewTasks || 0, color: '#f59e0b' },
    { name: 'Done', value: stats?.completedTasks || 0, color: '#10b981' },
  ];

  const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-surface-800/95 backdrop-blur-xl border border-surface-600/30 rounded-xl px-4 py-2.5 text-sm text-white shadow-xl">
        <span className="font-medium">{payload[0].name}:</span> {payload[0].value}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="animate-slide-in">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-surface-400 text-sm mt-1">Overview of your team's progress</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-800/30 border border-surface-700/20 animate-slide-in-right">
          <HiOutlineLightningBolt className="text-brand-400 text-sm animate-bounce-subtle" />
          <span className="text-xs text-surface-400">Live</span>
          <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #f43f5e, #f59e0b)' }} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, gradient, link }, idx) => (
          <div
            key={label}
            onClick={() => navigate(link)}
            className="card-glow p-5 flex items-center gap-4 cursor-pointer group animate-slide-up"
            style={{ animationDelay: `${idx * 0.08}s` }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(link)}
          >
            <div className={`relative p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
              <Icon className="text-2xl text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-surface-400">{label}</p>
              <p className="text-2xl font-bold text-white animate-count-up">{value}</p>
            </div>
            <HiOutlineArrowRight className="text-surface-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Status Distribution</h3>
          {pieData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie><Tooltip content={<ChartTooltip />} /></PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-surface-600">No data yet</div>}
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {pieData.map(d => <span key={d.name} className="flex items-center gap-1.5 text-xs text-surface-400"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />{d.name}</span>)}
          </div>
        </div>

        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Tasks by Project</h3>
          {tasksPerProject?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tasksPerProject}><XAxis dataKey="project" stroke="#71717a" fontSize={11} /><YAxis stroke="#71717a" fontSize={11} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="total" fill="#f43f5e" radius={[6, 6, 0, 0]} /><Bar dataKey="completed" fill="#f59e0b" radius={[6, 6, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[250px] flex items-center justify-center text-surface-600">No projects yet</div>}
        </div>
      </div>

      {/* Team Workload */}
      {tasksPerUser?.length > 0 && (
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Team Workload</h3>
          <div className="space-y-4">
            {tasksPerUser.map((u, i) => (
              <div key={i} className="flex items-center gap-4 group hover:bg-surface-800/20 p-2 -mx-2 rounded-xl transition-all duration-300">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-brand-200 border border-brand-500/20 group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(245,158,11,0.15) 100%)' }}>
                  {u.user?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5"><span className="text-sm text-surface-200">{u.user}</span><span className="text-xs text-surface-500">{u.completed}/{u.total} done</span></div>
                  <div className="h-2 bg-surface-800/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${u.total > 0 ? (u.completed / u.total) * 100 : 0}%`, background: 'linear-gradient(90deg, #e11d48, #f59e0b)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Tasks + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="p-5 border-b border-surface-700/20 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">My Tasks</h3>
            <button onClick={() => navigate('/tasks')} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition group">View All <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" /></button>
          </div>
          <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
            {!myTasks?.length ? <p className="text-surface-600 text-center py-8 text-sm">No tasks assigned yet</p> : myTasks.slice(0, 8).map((t, idx) => (
              <div key={t._id} className="flex items-center justify-between p-3 bg-surface-800/20 rounded-xl hover:bg-surface-800/40 transition-all duration-300 cursor-pointer border border-transparent hover:border-surface-700/20 hover:translate-x-1" style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => navigate('/tasks')}>
                <div className="min-w-0 flex-1"><p className="text-sm text-surface-200 truncate">{t.title}</p><p className={`text-xs mt-0.5 ${isOverdue(t.dueDate, t.status) ? 'text-red-400' : 'text-surface-500'}`}>{t.project?.title} • {formatDate(t.dueDate)}</p></div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="p-5 border-b border-surface-700/20 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            <button onClick={() => navigate('/tasks')} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition group">View All <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" /></button>
          </div>
          <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
            {!recentActivity?.length ? <p className="text-surface-600 text-center py-8 text-sm">No activity yet</p> : recentActivity.map((t, idx) => (
              <div key={t._id} className="flex items-center gap-3 p-3 bg-surface-800/20 rounded-xl hover:bg-surface-800/40 transition-all duration-300 cursor-pointer border border-transparent hover:border-surface-700/20" style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => navigate('/tasks')}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.status === 'completed' ? 'bg-emerald-400' : t.status === 'in-progress' ? 'bg-brand-400' : 'bg-surface-500'}`} />
                <div className="min-w-0 flex-1"><p className="text-sm text-surface-200 truncate">{t.title}</p><p className="text-xs text-surface-500">{t.project?.title} • {formatDate(t.updatedAt)}</p></div>
                <PriorityBadge priority={t.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
