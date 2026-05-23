export const formatDate = (date) => {
  if (!date) return 'No date';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const isOverdue = (date, status) => {
  if (!date || status === 'completed') return false;
  return new Date(date) < new Date();
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-surface-700/50 text-surface-300 border border-surface-600/30' },
  medium: { label: 'Medium', color: 'bg-blue-500/15 text-blue-300 border border-blue-500/25' },
  high: { label: 'High', color: 'bg-amber-500/15 text-amber-300 border border-amber-500/25' },
  urgent: { label: 'Urgent', color: 'bg-red-500/15 text-red-300 border border-red-500/25 animate-pulse-slow' },
};

export const STATUS_CONFIG = {
  'todo': { label: 'To Do', color: 'bg-surface-700/50 text-surface-300 border border-surface-600/30', dot: 'bg-surface-400' },
  'in-progress': { label: 'In Progress', color: 'bg-brand-500/15 text-brand-300 border border-brand-500/25', dot: 'bg-brand-400' },
  'review': { label: 'Review', color: 'bg-amber-500/15 text-amber-300 border border-amber-500/25', dot: 'bg-amber-400' },
  'completed': { label: 'Done', color: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25', dot: 'bg-emerald-400' },
};
