import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4 relative overflow-hidden">
    <div className="absolute inset-0 dot-pattern opacity-10" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[180px] opacity-15" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.5), transparent 70%)' }} />

    <div className="text-center animate-slide-up relative">
      <h1 className="text-8xl font-bold gradient-text-static animate-float">404</h1>
      <h2 className="text-2xl font-semibold text-white mt-4 animate-blur-in" style={{ animationDelay: '0.2s' }}>Page Not Found</h2>
      <p className="text-surface-400 mt-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>The page you're looking for doesn't exist.</p>
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 mt-6">
          <HiOutlineHome /> Back to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
