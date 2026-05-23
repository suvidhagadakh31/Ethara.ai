import { HiOutlineX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} animate-scale-in`}>
        {/* Gradient border */}
        <div className="absolute -inset-[1px] rounded-2xl opacity-60" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.4), rgba(245,158,11,0.3), rgba(244,63,94,0.2))' }} />

        <div className="relative bg-surface-900 rounded-2xl shadow-2xl shadow-brand-900/20 overflow-hidden">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #e11d48, #f59e0b, #e11d48)' }} />

          <div className="flex items-center justify-between p-5 border-b border-surface-700/30">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="btn-ghost p-1.5 hover:bg-surface-700/50 hover:rotate-90 transition-all duration-300" aria-label="Close">
              <HiOutlineX className="text-lg" />
            </button>
          </div>
          <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
