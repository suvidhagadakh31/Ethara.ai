/**
 * Project Detail Page - Team Task Management
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import authService from '../services/authService';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import { PageSpinner } from '../components/Spinner';
import { formatDate, isOverdue, STATUS_CONFIG } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus, HiOutlineTrash, HiOutlineUserAdd, HiOutlineArrowLeft,
  HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamation,
  HiOutlinePencil, HiOutlineFilter, HiOutlineUser
} from 'react-icons/hi';

const ProjectDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { isAdmin, user } = useAuth();
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTask, setShowTask] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showEditTask, setShowEditTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
  const [editForm, setEditForm] = useState({});
  const [filterMember, setFilterMember] = useState('');

  const fetchAll = async () => {
    try {
      const [pRes, tRes, uRes] = await Promise.all([
        projectService.getById(id),
        taskService.getAll({ project: id }),
        authService.getUsers()
      ]);
      setProject(pRes.data.project);
      setProgress(pRes.data.progress);
      setTasks(tRes.data.tasks);
      setUsers(uRes.data.users);
    } catch {
      toast.error('Failed to load project');
      nav('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskService.create({ ...taskForm, project: id });
      toast.success('Task created!');
      setShowTask(false);
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskService.update(showEditTask._id, editForm);
      toast.success('Task updated!');
      setShowEditTask(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (taskId, status) => {
    try {
      await taskService.update(taskId, { status });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskService.remove(taskId);
      toast.success('Task deleted');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const openEditTask = (task) => {
    setShowEditTask(task);
    setEditForm({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo?._id || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
  };

  const handleAddMember = async (userId) => {
    try {
      await projectService.addMember(id, userId);
      toast.success('Member added!');
      setShowMember(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await projectService.removeMember(id, userId);
      toast.success('Member removed');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <PageSpinner />;
  if (!project) return null;

  const nonMembers = users.filter(u => !project.members?.some(m => m._id === u._id));
  const columns = ['todo', 'in-progress', 'review', 'completed'];

  const filteredTasks = filterMember === 'unassigned'
    ? tasks.filter(t => !t.assignedTo)
    : filterMember
      ? tasks.filter(t => t.assignedTo?._id === filterMember)
      : tasks;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => nav('/projects')} className="btn-ghost p-2" aria-label="Back">
          <HiOutlineArrowLeft className="text-xl" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{project.title}</h1>
          <p className="text-surface-400 text-sm mt-0.5">{project.description || 'No description'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowTask(true)} className="btn-primary flex items-center gap-2">
            <HiOutlinePlus /><span className="hidden sm:inline">Add Task</span>
          </button>
        )}
      </div>

      {/* Progress Tracking */}
      {progress && (
        <div className="card p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent)' }} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Project Progress</h3>
              <span className="text-2xl font-bold gradient-text">{progress.percentage}%</span>
            </div>
            <div className="relative h-3 bg-surface-800/60 rounded-full overflow-hidden mt-3">
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${progress.percentage}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="flex items-center gap-2.5 p-3 bg-surface-800/30 rounded-xl border border-surface-700/20">
                <HiOutlineClock className="text-surface-400" />
                <div><p className="text-lg font-bold text-white">{progress.todoTasks}</p><p className="text-[10px] text-surface-500">Todo</p></div>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-surface-800/30 rounded-xl border border-surface-700/20">
                <HiOutlineClock className="text-brand-400" />
                <div><p className="text-lg font-bold text-white">{progress.inProgressTasks}</p><p className="text-[10px] text-surface-500">In Progress</p></div>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-surface-800/30 rounded-xl border border-surface-700/20">
                <HiOutlineCheckCircle className="text-emerald-400" />
                <div><p className="text-lg font-bold text-white">{progress.completedTasks}</p><p className="text-[10px] text-surface-500">Done</p></div>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-surface-800/30 rounded-xl border border-surface-700/20">
                <HiOutlineExclamation className="text-red-400" />
                <div><p className="text-lg font-bold text-white">{progress.overdueTasks}</p><p className="text-[10px] text-surface-500">Overdue</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Filter Bar */}
      <div className="card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-surface-400">
          <HiOutlineFilter className="text-sm" />
          <span className="text-sm">Filter by member:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setFilterMember('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${!filterMember ? 'text-white shadow-glow-sm' : 'bg-surface-800/40 text-surface-400 hover:text-white'}`} style={!filterMember ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}>
            All ({tasks.length})
          </button>
          {project.members?.map(m => {
            const count = tasks.filter(t => t.assignedTo?._id === m._id).length;
            return (
              <button key={m._id} onClick={() => setFilterMember(m._id === filterMember ? '' : m._id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${filterMember === m._id ? 'text-white shadow-glow-sm' : 'bg-surface-800/40 text-surface-400 hover:text-white'}`} style={filterMember === m._id ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}>
                <Avatar name={m.name} size="sm" className="w-5 h-5 text-[8px]" />
                {m.name.split(' ')[0]}
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
          <button onClick={() => setFilterMember('unassigned')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${filterMember === 'unassigned' ? 'text-white shadow-glow-sm' : 'bg-surface-800/40 text-surface-400 hover:text-white'}`} style={filterMember === 'unassigned' ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}>
            <HiOutlineUser className="text-xs" />
            Unassigned
            <span className="text-[10px] opacity-70">({tasks.filter(t => !t.assignedTo).length})</span>
          </button>
        </div>
      </div>

      {/* Task Board (Kanban) */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">
          Task Board
          {filterMember && filterMember !== 'unassigned' && (
            <span className="text-surface-400 font-normal ml-2">— {project.members?.find(m => m._id === filterMember)?.name}'s tasks</span>
          )}
          {filterMember === 'unassigned' && (
            <span className="text-surface-400 font-normal ml-2">— Unassigned tasks</span>
          )}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map(col => {
            let colTasks = filteredTasks.filter(t => t.status === col);
            if (filterMember === 'unassigned') {
              colTasks = tasks.filter(t => t.status === col && !t.assignedTo);
            }
            const cfg = STATUS_CONFIG[col];
            return (
              <div key={col} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-sm font-medium text-surface-300">{cfg.label}</span>
                  <span className="ml-auto text-xs bg-surface-800/40 text-surface-400 px-2 py-0.5 rounded-full border border-surface-700/20">{colTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[80px] p-2 bg-surface-900/30 rounded-xl border border-surface-800/30">
                  {colTasks.length === 0 && (
                    <p className="text-[10px] text-surface-600 text-center py-6">No tasks</p>
                  )}
                  {colTasks.map(task => {
                    const isMyTask = task.assignedTo?._id === user?.id;
                    return (
                      <div key={task._id} className="card p-3.5 hover:border-brand-500/20 transition-all duration-300 group">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white leading-snug">{task.title}</p>
                          {isAdmin && (
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEditTask(task)} className="p-1 text-surface-500 hover:text-brand-400 rounded transition" aria-label="Edit"><HiOutlinePencil className="text-xs" /></button>
                              <button onClick={() => handleDeleteTask(task._id)} className="p-1 text-surface-500 hover:text-red-400 rounded transition" aria-label="Delete"><HiOutlineTrash className="text-xs" /></button>
                            </div>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-surface-500 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <PriorityBadge priority={task.priority} />
                          {task.dueDate && (
                            <span className={`text-[10px] flex items-center gap-0.5 ${isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-surface-500'}`}>
                              <HiOutlineCalendar />{formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-800/30">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-1.5">
                              <Avatar name={task.assignedTo.name} size="sm" />
                              <span className="text-[10px] text-surface-400">{task.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-surface-600 italic">Unassigned</span>
                          )}
                          {(isAdmin || isMyTask) && (
                            <select value={task.status} onChange={e => handleStatus(task._id, e.target.value)} className="text-[10px] bg-surface-800/40 border border-surface-700/30 rounded px-1.5 py-0.5 text-surface-300 outline-none cursor-pointer backdrop-blur-sm" aria-label="Change status">
                              {columns.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                            </select>
                          )}
                          {!isAdmin && !isMyTask && <StatusBadge status={task.status} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Members */}
      <div className="card">
        <div className="p-4 border-b border-surface-700/20 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Team Members ({project.members?.length})</h3>
          {isAdmin && (
            <button onClick={() => setShowMember(true)} className="btn-ghost p-1.5 text-brand-400" aria-label="Add member">
              <HiOutlineUserAdd className="text-lg" />
            </button>
          )}
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {project.members?.map(m => {
            const memberTasks = tasks.filter(t => t.assignedTo?._id === m._id);
            const memberCompleted = memberTasks.filter(t => t.status === 'completed').length;
            return (
              <div key={m._id} className="p-3 bg-surface-800/20 rounded-xl border border-surface-700/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size="sm" />
                    <div>
                      <p className="text-sm text-surface-200">{m.name}</p>
                      <p className="text-[10px] text-surface-500">{m.role}</p>
                    </div>
                  </div>
                  {isAdmin && m._id !== project.createdBy?._id && (
                    <button onClick={() => handleRemoveMember(m._id)} className="text-[10px] text-red-400 hover:text-red-300 transition">Remove</button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface-700/20">
                  <div className="flex-1 h-1.5 bg-surface-700/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${memberTasks.length > 0 ? (memberCompleted / memberTasks.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
                  </div>
                  <span className="text-[10px] text-surface-500">{memberCompleted}/{memberTasks.length} tasks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={showTask} onClose={() => setShowTask(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Task Title *</label>
            <input type="text" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} className="input" placeholder="What needs to be done?" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Description</label>
            <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} className="input resize-none" rows={3} placeholder="Add details..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Assign To</label>
            <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })} className="input">
              <option value="">Unassigned</option>
              {project.members?.map(m => <option key={m._id} value={m._id}>{m.name} ({m.role})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Priority</label>
              <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} className="input">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Due Date</label>
              <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="input" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowTask(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Creating...' : 'Create Task'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={!!showEditTask} onClose={() => setShowEditTask(null)} title="Edit Task">
        <form onSubmit={handleEditTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Title</label>
            <input type="text" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Description</label>
            <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="input resize-none" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Assign To</label>
            <select value={editForm.assignedTo || ''} onChange={e => setEditForm({ ...editForm, assignedTo: e.target.value })} className="input">
              <option value="">Unassigned</option>
              {project.members?.map(m => <option key={m._id} value={m._id}>{m.name} ({m.role})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Status</label>
              <select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="input">
                <option value="todo">Todo</option><option value="in-progress">In Progress</option><option value="review">Review</option><option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Priority</label>
              <select value={editForm.priority || ''} onChange={e => setEditForm({ ...editForm, priority: e.target.value })} className="input">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Due Date</label>
              <input type="date" value={editForm.dueDate || ''} onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })} className="input" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowEditTask(null)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={showMember} onClose={() => setShowMember(false)} title="Add Team Member">
        {!nonMembers.length ? (
          <p className="text-surface-500 text-center py-6">All registered users are already members.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {nonMembers.map(u => (
              <div key={u._id} className="flex items-center justify-between p-3 bg-surface-800/30 rounded-xl border border-surface-700/20">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="sm" />
                  <div>
                    <p className="text-sm text-surface-200">{u.name}</p>
                    <p className="text-[10px] text-surface-500">{u.email} • {u.role}</p>
                  </div>
                </div>
                <button onClick={() => handleAddMember(u._id)} className="btn-primary text-xs py-1.5 px-3">Add</button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;
