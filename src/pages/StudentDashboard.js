import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Search, Filter, Clock, FileText, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Common/Navbar';
import PriorityBadge, { StatusBadge } from '../components/Common/PriorityBadge';
import ComplaintProgress from '../components/Common/ComplaintProgress';
import { CardSkeleton, StatSkeleton } from '../components/Common/Skeleton';

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 border border-white/10">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <p className="text-2xl font-display font-bold text-white">{value}</p>
    <p className="text-slate-400 text-sm mt-1">{label}</p>
  </motion.div>
);

const ComplaintCard = ({ complaint, index }) => {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return 'Just now';
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Link to={`/complaint/${complaint._id}`}>
        <div className="glass-card rounded-2xl p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate">{complaint.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">{complaint.complaintId}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          <p className="text-slate-400 text-sm line-clamp-2 mb-4">{complaint.description}</p>

          <ComplaintProgress status={complaint.status} />

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
            <div className="flex items-center gap-3">
              <StatusBadge status={complaint.status} />
              <span className="text-xs text-slate-500">{complaint.category}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Clock size={12} />
              {timeAgo(complaint.createdAt)}
            </div>
          </div>

          {complaint.assignedTo && (
            <p className="text-xs text-slate-500 mt-2">→ Routed to: <span className="text-slate-300">{complaint.assignedTo}</span></p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const fetchComplaints = useCallback(async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      if (search) params.search = search;
      const { data } = await axios.get('/complaints/my', { params });
      setComplaints(data.complaints);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, search]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  // Real-time socket
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    socket.emit('join_room', user._id);
    socket.on('complaint_updated', ({ message }) => {
      toast.success(message, { duration: 5000 });
      fetchComplaints();
    });
    return () => socket.disconnect();
  }, [user._id, fetchComplaints]);

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    high: complaints.filter(c => c.priority === 'high').length,
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-8 border border-purple-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-slate-400 mt-1">Track and manage your campus complaints</p>
            </div>
            <Link to="/submit">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="btn-primary px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 shadow-lg">
                <PlusCircle size={18} /> New Complaint
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />) : (
            <>
              <StatCard icon={<FileText size={18} className="text-white" />} label="Total Submitted" value={stats.total} color="from-blue-500 to-blue-700" delay={0} />
              <StatCard icon={<CheckCircle size={18} className="text-white" />} label="Resolved" value={stats.resolved} color="from-emerald-500 to-emerald-700" delay={0.1} />
              <StatCard icon={<RefreshCw size={18} className="text-white" />} label="In Progress" value={stats.inProgress} color="from-amber-500 to-orange-600" delay={0.2} />
              <StatCard icon={<AlertTriangle size={18} className="text-white" />} label="High Priority" value={stats.high} color="from-red-500 to-rose-700" delay={0.3} />
            </>
          )}
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..."
                className="input-glass w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="input-glass px-3 py-2.5 rounded-xl text-sm appearance-none bg-slate-800/50 text-slate-300">
              <option value="">All Statuses</option>
              {['submitted','assigned','in_progress','resolved'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="input-glass px-3 py-2.5 rounded-xl text-sm appearance-none bg-slate-800/50 text-slate-300">
              <option value="">All Priorities</option>
              {['high','medium','low'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {(search || filterStatus || filterPriority) && (
              <button onClick={() => { setSearch(''); setFilterStatus(''); setFilterPriority(''); }}
                className="text-sm text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all">
                Clear filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Complaints List */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">{Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : complaints.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
              <FileText size={32} className="text-purple-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">No complaints yet</h3>
            <p className="text-slate-400 mb-6">Got an issue? Submit your first complaint.</p>
            <Link to="/submit">
              <button className="btn-primary px-6 py-3 rounded-xl font-semibold text-white">Submit Complaint</button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {complaints.map((c, i) => <ComplaintCard key={c._id} complaint={c} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
