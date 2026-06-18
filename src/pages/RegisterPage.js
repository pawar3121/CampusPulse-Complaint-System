import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Hash, BookOpen, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', studentId: '', department: '', year: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', icon, placeholder, required }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
        {name === 'password' ? (
          <>
            <input type={showPass ? 'text' : 'password'} name={name} value={form[name]} onChange={handleChange}
              placeholder={placeholder} autoComplete="off" disabled={loading}
              className="input-glass w-full pl-10 pr-12 py-3 rounded-xl text-sm disabled:opacity-50" />
            <button type="button" onClick={() => setShowPass(!showPass)} disabled={loading}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 disabled:opacity-50">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </>
        ) : (
          <input type={type} name={name} value={form[name]} onChange={handleChange}
            placeholder={placeholder} autoComplete="off" disabled={loading}
            className="input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm disabled:opacity-50" />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-display font-bold">CP</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text-blue">CampusPulse</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-slate-400">Join thousands of students</p>
        </div>

        <motion.div className="glass-card rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="Full Name" name="name" icon={<User size={16} />} placeholder="Ravi Kumar" required />
            <InputField label="Email" name="email" type="email" icon={<Mail size={16} />} placeholder="ravi@college.edu" required />
            <InputField label="Password" name="password" icon={<Lock size={16} />} placeholder="Min 6 characters" required />

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Student ID" name="studentId" icon={<Hash size={16} />} placeholder="21CS001" />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                <select name="year" value={form.year} onChange={handleChange} disabled={loading}
                  className="input-glass w-full px-3 py-3 rounded-xl text-sm appearance-none bg-slate-800/50 text-slate-300 disabled:opacity-50">
                  <option value="">Select Year</option>
                  {['1st', '2nd', '3rd', '4th'].map(y => <option key={y} value={y}>{y} Year</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
              <div className="relative">
                <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <select name="department" value={form.department} onChange={handleChange} disabled={loading}
                  className="input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm appearance-none bg-slate-800/50 text-slate-300 disabled:opacity-50">
                  <option value="">Select Department</option>
                  {['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology', 'MBA', 'Other'].map(d =>
                    <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader size={18} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        </motion.div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
