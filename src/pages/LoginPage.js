import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    if (type === 'admin') setForm({ email: 'admin@campuspulse.com', password: 'Admin@123' });
    else setForm({ email: 'student@test.com', password: 'Student@123' });
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-display font-bold">CP</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text-blue">CampusPulse</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to your account</p>
        </div>

        {/* Demo credentials */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => fillDemo('student')}
            className="flex-1 py-2 px-3 rounded-xl glass-card border border-blue-500/20 text-blue-300 text-xs font-medium hover:bg-blue-500/10 transition-all">
            🎓 Demo Student
          </button>
          <button onClick={() => fillDemo('admin')}
            className="flex-1 py-2 px-3 rounded-xl glass-card border border-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/10 transition-all">
            🛡 Demo Admin
          </button>
        </div>

        {/* Form */}
        <motion.div className="glass-card rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@college.edu"
                  autoComplete="off"
                  disabled={loading}
                  className="input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  autoComplete="off"
                  disabled={loading}
                  className="input-glass w-full pl-10 pr-12 py-3 rounded-xl text-sm disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 disabled:opacity-50">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader size={18} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        </motion.div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
