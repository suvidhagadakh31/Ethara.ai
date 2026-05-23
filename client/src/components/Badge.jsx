import { PRIORITY_CONFIG, STATUS_CONFIG } from '../utils/helpers';

export const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return <span className={`badge ${config.color}`}>{config.label}</span>;
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;
  return <span className={`badge ${config.color}`}>{config.label}</span>;
};

export const RoleBadge = ({ role }) => (
  <span className={`badge ${role === 'admin' ? 'bg-gradient-to-r from-brand-500/20 to-accent-500/20 text-brand-300 border border-brand-500/25' : 'bg-gradient-to-r from-surface-600/30 to-surface-700/30 text-surface-300 border border-surface-500/25'}`}>
    {role}
  </span>
);
