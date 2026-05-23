const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} rounded-full animate-spin ${className}`} style={{ border: '3px solid rgba(244,63,94,0.15)', borderTopColor: '#f43f5e', borderRightColor: '#f59e0b' }} />
  );
};

export const PageSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="relative animate-float">
      <Spinner size="lg" />
      <div className="absolute inset-0 rounded-full blur-lg opacity-40 animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #f43f5e, #f59e0b)' }} />
    </div>
  </div>
);

export default Spinner;
