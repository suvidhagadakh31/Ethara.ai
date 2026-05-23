const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="card p-12 text-center animate-fade-in relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 dot-pattern opacity-20" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.4), transparent)' }} />

    <div className="relative">
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-float" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.1) 0%, rgba(245,158,11,0.08) 100%)' }}>
          <Icon className="text-3xl text-surface-500" />
        </div>
      )}
      <h3 className="text-lg font-medium text-surface-300">{title}</h3>
      {description && <p className="text-surface-500 mt-1.5 text-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  </div>
);

export default EmptyState;
