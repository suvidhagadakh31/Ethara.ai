/**
 * Tasks Page - Full task list with RBAC-aware actions.
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import SearchFilter from '../components/SearchFilter';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import { RowSkeleton } from '../components/Skeleton';
import { formatDate, isOverdue } from '../utils/helpers';
import useDebounce from '../hooks/useDebounce';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlineCalendar, HiOutlineClipboardList, HiOutlinePencil, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [editTask, setEditTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchTasks = () => {
    setLoading(true);
    const apiStatus = status === 'overdue' ? '' : status;
    taskService.getAll({ search: debouncedSearch, status: apiStatus, priority, sort, page, limit: 20 })
      .then(r => {
        let fetchedTasks = r.data.tasks;
        if (status === 'overdue') {
          fetchedTasks = fetchedTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed');
        }
        setTasks(fetchedTasks);
        setPagination(r.data.pagination || { total: fetchedTasks.length, pages: 1 });
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const urlStatus = searchParams.get('status') || '';
    if (urlStatus !== status) setStatus(urlStatus);
  }, [searchParams]);

  useEffect(() => { setPage(1); }, [debouncedSearch, status, priority, sort]);
  useEffect(() => { fetchTasks(); }, [debouncedSearch, status, priority, sort, page]);

  const canEditTask = () => isAdmin;
  const canDeleteTask = () => isAdmin;
  const canChangeStatus = (task) => isAdmin || task.assignedTo?._id === user?.id;

  const handleStatus = async (id, newStatus) => {
    try {
      await taskService.update(id, { status: newStatus });
      fetchTasks();
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Permission denied');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await taskService.remove(id); toast.success('Task deleted'); fetchTasks(); }
    catch (err) { toast.error(err.response?.data?.message || 'Permission denied'); }
  };

  const openEdit = (t) => {
    setEditTask(t);
    setEditForm({ title: t.title, description: t.description || '', priority: t.priority, status: t.status, dueDate: t.dueDate ? t.dueDate.split('T')[0] : '' });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskService.update(editTask._id, editForm);
      toast.success('Task updated!');
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filters = [
    { value: status, onChange: setStatus, label: 'Status', options: [{ value: '', label: 'All Status' }, { value: 'todo', label: 'Todo' }, { value: 'in-progress', label: 'In Progress' }, { value: 'review', label: 'Review' }, { value: 'completed', label: 'Completed' }, { value: 'overdue', label: 'Overdue' }] },
    { value: priority, onChange: setPriority, label: 'Priority', options: [{ value: '', label: 'All Priority' }, { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }] },
    { value: sort, onChange: setSort, label: 'Sort', options: [{ value: '', label: 'Newest' }, { value: 'dueDate', label: 'Due Date' }, { value: 'priority', label: 'Priority' }, { value: 'status', label: 'Status' }] },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <p className="text-surface-400 text-sm mt-1">{loading ? '...' : `${pagination.total} task${pagination.total !== 1 ? 's' : ''} total`}</p>
      </div>

      <SearchFilter search={search} onSearchChange={setSearch} filters={filters} />

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <RowSkeleton key={i} />)}</div>
      ) : !tasks.length ? (
        <EmptyState icon={HiOutlineClipboardList} title="No tasks found" description={status || priority || search ? 'Try different filters.' : 'Create tasks from a project.'} />
      ) : (
        <>
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t._id} className="card p-4 hover:border-brand-500/20 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-medium text-white truncate">{t.title}</h3>
                      <PriorityBadge priority={t.priority} />
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-surface-500 flex-wrap">
                      {t.project?.title && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />{t.project.title}
                        </span>
                      )}
                      <span>{t.assignedTo?.name || 'Unassigned'}</span>
                      {t.dueDate && (
                        <span className={`flex items-center gap-0.5 ${isOverdue(t.dueDate, t.status) ? 'text-red-400' : ''}`}>
                          <HiOutlineCalendar />{formatDate(t.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canEditTask(t) && (
                      <button onClick={() => openEdit(t)} className="btn-ghost p-1.5" aria-label="Edit task"><HiOutlinePencil className="text-sm" /></button>
                    )}
                    {canChangeStatus(t) && (
                      <select value={t.status} onChange={e => handleStatus(t._id, e.target.value)} className="text-xs bg-surface-800/40 border border-surface-700/30 rounded-lg px-2 py-1.5 text-surface-300 outline-none backdrop-blur-sm" aria-label="Change status">
                        <option value="todo">Todo</option><option value="in-progress">In Progress</option><option value="review">Review</option><option value="completed">Completed</option>
                      </select>
                    )}
                    {canDeleteTask(t) && (
                      <button onClick={() => handleDelete(t._id)} className="p-1.5 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" aria-label="Delete task"><HiOutlineTrash className="text-sm" /></button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-surface-500">Page {page} of {pagination.pages} ({pagination.total} items)</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn-ghost p-2 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Previous page"><HiOutlineChevronLeft /></button>
                {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-medium transition ${page === pageNum ? 'text-white shadow-glow-sm' : 'text-surface-400 hover:bg-surface-800'}`} style={page === pageNum ? { background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' } : {}}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages} className="btn-ghost p-2 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Next page"><HiOutlineChevronRight /></button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
        <form onSubmit={handleEdit} className="space-y-4">
          {isAdmin ? (
            <>
              <div><label className="block text-sm font-medium text-surface-300 mb-2">Title</label><input type="text" value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="input" required /></div>
              <div><label className="block text-sm font-medium text-surface-300 mb-2">Description</label><textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="input resize-none" rows={2} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-sm font-medium text-surface-300 mb-2">Status</label><select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="input"><option value="todo">Todo</option><option value="in-progress">In Progress</option><option value="review">Review</option><option value="completed">Completed</option></select></div>
                <div><label className="block text-sm font-medium text-surface-300 mb-2">Priority</label><select value={editForm.priority || ''} onChange={e => setEditForm({ ...editForm, priority: e.target.value })} className="input"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
                <div><label className="block text-sm font-medium text-surface-300 mb-2">Due Date</label><input type="date" value={editForm.dueDate || ''} onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })} className="input" /></div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-surface-800/30 rounded-xl border border-surface-700/20">
                <p className="text-sm text-surface-300 font-medium">{editTask?.title}</p>
                <p className="text-xs text-surface-500 mt-1">As a member, you can only update the task status.</p>
              </div>
              <div><label className="block text-sm font-medium text-surface-300 mb-2">Status</label><select value={editForm.status || ''} onChange={e => setEditForm({ status: e.target.value })} className="input"><option value="todo">Todo</option><option value="in-progress">In Progress</option><option value="review">Review</option><option value="completed">Completed</option></select></div>
            </>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setEditTask(null)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
