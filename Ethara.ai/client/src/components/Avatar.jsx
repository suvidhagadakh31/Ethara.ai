import { getInitials } from '../utils/helpers';

const colors = [
  'from-brand-500/40 to-brand-700/40 text-brand-200',
  'from-accent-500/40 to-accent-700/40 text-accent-200',
  'from-emerald-500/40 to-emerald-700/40 text-emerald-200',
  'from-violet-500/40 to-violet-700/40 text-violet-200',
  'from-rose-500/40 to-rose-700/40 text-rose-200',
  'from-cyan-500/40 to-cyan-700/40 text-cyan-200',
];

const Avatar = ({ name, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  const colorIdx = name ? name.charCodeAt(0) % colors.length : 0;

  return (
    <div className={`${sizes[size]} bg-gradient-to-br ${colors[colorIdx]} rounded-xl flex items-center justify-center font-bold flex-shrink-0 border border-white/10 shadow-inner-glow transition-transform duration-300 hover:scale-105 ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
