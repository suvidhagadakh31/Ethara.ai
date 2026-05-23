import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { HiSparkles } from 'react-icons/hi2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[180px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.4) 0%, rgba(245,158,11,0.15) 40%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
      <div className="absolute top-20 left-20 w-3 h-3 rounded-full bg-brand-500/30 animate-float" />
      <div className="absolute bottom-32 right-32 w-2 h-2 rounded-full bg-accent-500/30 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-20 w-2 h-2 rounded-full bg-brand-400/20 animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow animate-float" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)' }}>
              <HiSparkles className="text-white text-2xl" />
            </div>
            <div className="absolute -inset-3 rounded-2xl opacity-25 blur-xl animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #e11d48 0%, #f59e0b 100%)' }} />
          </div>
          <h1 className="text-3xl font-bold text-white animate-blur-in">Welcome Back</h1>
          <p className="text-surface-400 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>Sign in to <span className="gradient-text font-semibold">TaskFlow Pro</span></p>
        </div>

        <div className="relative animate-scale-in" style={{ animationDelay: '0.1s' }}>
          {/* Card border gradient */}
          <div className="absolute -inset-[1px] rounded-2xl opacity-60" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.4), rgba(245,158,11,0.3), rgba(244,63,94,0.15))' }} />

          <form onSubmit={handleSubmit} className="relative bg-surface-900/90 backdrop-blur-xl rounded-2xl p-8 space-y-5">
            <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="email" className="block text-sm font-medium text-surface-300 mb-2">Email Address</label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-400 transition-colors duration-300" />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" placeholder="you@example.com" required autoComplete="email" />
              </div>
            </div>
            <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="password" className="block text-sm font-medium text-surface-300 mb-2">Password</label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-400 transition-colors duration-300" />
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11" placeholder="••••••••" required autoComplete="current-password" />
              </div>
            </div>
            <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span> : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-surface-400 mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Don't have an account? <Link to="/signup" className="text-brand-400 font-medium hover:text-brand-300 transition hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
