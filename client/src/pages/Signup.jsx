import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { HiSparkles } from 'react-icons/hi2';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      toast.success('Account created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(244,63,94,0.15) 50%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10" style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
      <div className="absolute top-40 right-16 w-2 h-2 rounded-full bg-accent-500/40 animate-float" />
      <div className="absolute bottom-20 left-20 w-3 h-3 rounded-full bg-brand-500/30 animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow-accent animate-float" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)' }}>
              <HiSparkles className="text-white text-2xl" />
            </div>
            <div className="absolute -inset-3 rounded-2xl opacity-25 blur-xl animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)' }} />
          </div>
          <h1 className="text-3xl font-bold text-white animate-blur-in">Join TaskFlow</h1>
          <p className="text-surface-400 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>Create your team account</p>
        </div>

        <div className="relative animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="absolute -inset-[1px] rounded-2xl opacity-60" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(244,63,94,0.3), rgba(245,158,11,0.15))' }} />

          <form onSubmit={handleSubmit} className="relative bg-surface-900/90 backdrop-blur-xl rounded-2xl p-8 space-y-5">
            <div className="animate-slide-in" style={{ animationDelay: '0.15s' }}>
              <label htmlFor="name" className="block text-sm font-medium text-surface-300 mb-2">Full Name</label>
              <div className="relative group">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-400 transition-colors duration-300" />
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} className="input pl-11" placeholder="John Doe" required />
              </div>
            </div>
            <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="email" className="block text-sm font-medium text-surface-300 mb-2">Email</label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-400 transition-colors duration-300" />
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="input pl-11" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="animate-slide-in" style={{ animationDelay: '0.25s' }}>
              <label htmlFor="password" className="block text-sm font-medium text-surface-300 mb-2">Password</label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-400 transition-colors duration-300" />
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className="input pl-11" placeholder="Min 6 chars + 1 number" minLength={6} required />
              </div>
            </div>
            <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="role" className="block text-sm font-medium text-surface-300 mb-2">Role</label>
              <select id="role" name="role" value={form.role} onChange={handleChange} className="input">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="animate-slide-in" style={{ animationDelay: '0.35s' }}>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</span> : 'Create Account'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-surface-400 mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Already have an account? <Link to="/login" className="text-brand-400 font-medium hover:text-brand-300 transition hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
