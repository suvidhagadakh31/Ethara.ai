import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import authService from '../services/authService';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';
import { CardSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineFolder, HiOutlineUserGroup } from 'react-icons/hi';

const Projects = () => {
  const { isAdmin, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', members: [] });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = () => projectService.getAll().then(r => setProjects(r.data.projects)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));

  useEffect(() => {
    fetchProjects();
    if (isAdmin) authService.getUsers().then(r => setUsers(r.data.users)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await projectService.update(editing._id, { title: form.title, description: form.description });
        toast.success('Project updated!');
      } else {
        await projectService.create({ title: form.title, description: form.description, members: form.members });
        toast.success('Project created!');
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all tasks?')) return;
    try { await projectService.remove(id); toast.success('Deleted'); fetchProjects(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, description: p.description || '', members: [] }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm({ title: '', description: '', members: [] }); };
  const toggleMember = (userId) => setForm(prev => ({ ...prev, members: prev.members.includes(userId) ? prev.members.filter(id => id !== userId) : [...prev.members, userId] }));
  const selectableUsers = users.filter(u => u._id !== user?.id);

  if (loading) return <div className="space-y-6"><div className="skeleton h-8 w-32 rounded" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}</div></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="animate-slide-in"><h1 className="text-2xl font-bold text-white">Projects</h1><p className="text-surface-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p></div>
        {isAdmin && <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 animate-slide-in-right"><HiOutlinePlus /><span className="hidden sm:inline">New Project</span></button>}
      </div>

      {!projects.length ? (
        <EmptyState icon={HiOutlineFolder} title="No projects yet" description={isAdmin ? 'Create your first project.' : 'Ask an admin to add you to a project.'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, idx) => (
            <div key={p._id} className="card-glow p-5 group animate-slide-up" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div className="flex items-start justify-between mb-3">
                <Link to={`/projects/${p._id}`} className="text-base font-semibold text-white hover:text-brand-300 transition truncate flex-1">{p.title}</Link>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 ml-2">
                    <button onClick={() => openEdit(p)} className="btn-ghost p-1.5" aria-label="Edit"><HiOutlinePencil className="text-sm" /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" aria-label="Delete"><HiOutlineTrash className="text-sm" /></button>
                  </div>
                )}
              </div>
              <p className="text-sm text-surface-500 line-clamp-2 mb-4 min-h-[2.5rem]">{p.description || 'No description'}</p>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-surface-500">Progress</span>
                  <span className="text-[10px] font-medium text-surface-300">{p.progress || 0}%</span>
                </div>
                <div className="h-1.5 bg-surface-800/60 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${p.progress || 0}%`, background: 'linear-gradient(90deg, #e11d48, #f59e0b)' }} />
                </div>
                <p className="text-[10px] text-surface-600 mt-1">{p.completedTasks || 0}/{p.totalTasks || 0} tasks done</p>
              </div>

              <div className="flex items-center justify-between text-xs text-surface-500">
                <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">active</span>
                <span className="flex items-center gap-1"><HiOutlineUserGroup />{p.members?.length || 0} members</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editing ? 'Edit Project' : 'New Project'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Project Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" placeholder="Enter project name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input resize-none" rows={3} placeholder="Brief description..." />
          </div>
          {!editing && selectableUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Add Members <span className="text-surface-500 font-normal">({form.members.length} selected)</span></label>
              <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-surface-800/30 rounded-xl border border-surface-700/20">
                {selectableUsers.map(u => (
                  <label key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-700/30 cursor-pointer transition">
                    <input type="checkbox" checked={form.members.includes(u._id)} onChange={() => toggleMember(u._id)} className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500" />
                    <Avatar name={u.name} size="sm" />
                    <div className="flex-1 min-w-0"><p className="text-sm text-surface-200 truncate">{u.name}</p><p className="text-[10px] text-surface-500">{u.email} • {u.role}</p></div>
                  </label>
                ))}
              </div>
              <p className="text-[10px] text-surface-500 mt-1">You (admin) are automatically added.</p>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : editing ? 'Update' : 'Create Project'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
