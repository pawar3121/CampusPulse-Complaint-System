import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, CheckCircle, AlertTriangle, Search, Filter, ChevronDown, X, MessageSquare, RefreshCw, TrendingUp, Loader } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Navbar from '../components/Common/Navbar';
import PriorityBadge, { StatusBadge } from '../components/Common/PriorityBadge';
import { StatSkeleton, CardSkeleton } from '../components/Common/Skeleton';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const CHART_OPTS = {
  plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'DM Sans' } } } },
  maintainAspectRatio: false,
};

const StatCard = ({ icon, label, value, sub, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 border border-white/10">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>{icon}</div>
      <TrendingUp size={14} className="text-slate-600" />
    </div>
    <p className="text-2xl font-display font-bold text-white">{value}</p>
    <p className="text-slate-400 text-sm mt-0.5">{label}</p>
    {sub && <p className="text-xs text-emerald-400 mt-1">{sub}</p>}
  </motion.div>
);

const STATUS_OPTIONS = ['submitted', 'assigned', 'in_progress', 'resolved'];

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [updating, setUpdating] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get('/admin/stats');
      setStats(data.stats);
    } catch {} finally { setStatsLoading(false); }
  }, []);

  const fetchComplaints = useCallback(async () => {
    try {
      const params = {};
      if (filterPriority) params.priority = filterPriority;
      if (filterStatus) params.status = filterStatus;
      if (search) params.search = search;
      const { data } = await axios.get('/admin/complaints', { params });
      setComplaints(data.complaints);
    } catch { toast.error('Failed to load complaints'); } finally { setLoading(false); }
  }, [filterPriority, filterStatus, search]);

  useEffect(() => { fetchStats(); fetchComplaints(); }, [fetchStats, fetchComplaints]);

  // Real-time
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    socket.on('new_complaint', () => { fetchComplaints(); fetchStats(); toast('📩 New complaint received!'); });
    return () => socket.disconnect();
  }, [fetchComplaints, fetchStats]);

  const updateStatus = async (cId, status) => {
    setUpdating(cId);
    try {
      await axios.patch(`/admin/complaints/${cId}/status`, { status });
      toast.success('Status updated');
      fetchComplaints(); fetchStats();
      if (activeComplaint?._id === cId) setActiveComplaint(prev => ({ ...prev, status }));
    } catch { toast.error('Failed to update'); } finally { setUpdating(null); }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      const { data } = await axios.post(`/admin/complaints/${activeComplaint._id}/comment`, { text: comment });
      setActiveComplaint(data.complaint);
      setComment('');
      toast.success('Comment added');
      fetchComplaints();
    } catch { toast.error('Failed to add comment'); } finally { setCommenting(false); }
  };

  // Chart data
  const priorityChart = stats ? {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [
        stats.byPriority.find(p => p._id === 'high')?.count || 0,
        stats.byPriority.find(p => p._id === 'medium')?.count || 0,
        stats.byPriority.find(p => p._id === 'low')?.count || 0,
      ],
      backgroundColor: ['rgba(239,68,68,0.6)', 'rgba(245,158,11,0.6)', 'rgba(34,197,94,0.6)'],
      borderColor: ['rgba(239,68,68,1)', 'rgba(245,158,11,1)', 'rgba(34,197,94,1)'],
      borderWidth: 2,
    }],
  } : null;

  const statusChart = stats ? {
    labels: stats.byStatus.map(s => s._id.replace('_', ' ')),
    datasets: [{
      label: 'Complaints',
      data: stats.byStatus.map(s => s.count),
      backgroundColor: ['rgba(148,163,184,0.6)', 'rgba(96,165,250,0.6)', 'rgba(251,191,36,0.6)', 'rgba(52,211,153,0.6)'],
      borderRadius: 8,
    }],
  } : null;

  const timeAgo = (d) => {
    const h = Math.floor((Date.now() - new Date(d)) / 3600000);
    return h < 1 ? 'Just now' : h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-slate-400">Monitor, prioritize and resolve campus complaints</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? Array(4).fill(0).map((_,i) => <StatSkeleton key={i} />) : stats && (
            <>
              <StatCard icon={<BarChart3 size={18} className="text-white" />} label="Total Complaints" value={stats.total} color="from-blue-500 to-blue-700" delay={0} />
              <StatCard icon={<Users size={18} className="text-white" />} label="Students" value={stats.totalStudents} color="from-purple-500 to-purple-700" delay={0.1} />
              <StatCard icon={<CheckCircle size={18} className="text-white" />} label="Resolution Rate" value={`${stats.resolutionRate}%`} sub="↑ This month" color="from-emerald-500 to-emerald-700" delay={0.2} />
              <StatCard icon={<AlertTriangle size={18} className="text-white" />} label="High Priority" value={stats.byPriority.find(p=>p._id==='high')?.count || 0} color="from-red-500 to-rose-700" delay={0.3} />
            </>
          )}
        </div>

        {/* Charts */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="font-display font-semibold text-white mb-4">Priority Breakdown</h3>
              <div className="h-48">{priorityChart && <Doughnut data={priorityChart} options={CHART_OPTS} />}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="font-display font-semibold text-white mb-4">Status Overview</h3>
              <div className="h-48">{statusChart && <Bar data={statusChart} options={{ ...CHART_OPTS, scales: { x: { ticks: { color: '#94a3b8' }, grid: { display: false } }, y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }} />}</div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-6 border border-white/10">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, ID..."
                className="input-glass w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" />
            </div>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="input-glass px-3 py-2.5 rounded-xl text-sm appearance-none bg-slate-800/50 text-slate-300">
              <option value="">All Priorities</option>
              {['high', 'medium', 'low'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="input-glass px-3 py-2.5 rounded-xl text-sm appearance-none bg-slate-800/50 text-slate-300">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
            <button onClick={() => { fetchComplaints(); fetchStats(); }}
              className="p-2.5 glass-card rounded-xl text-slate-400 hover:text-white border border-white/10 transition-all">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Two-pane: list + detail */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Complaints list */}
          <div className={`${activeComplaint ? 'lg:col-span-2' : 'lg:col-span-5'} space-y-3`}>
            {loading ? Array(5).fill(0).map((_,i) => <CardSkeleton key={i} />) : complaints.length === 0 ? (
              <div className="text-center py-16 text-slate-500">No complaints found</div>
            ) : complaints.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => setActiveComplaint(c)}
                className={`glass-card rounded-xl p-4 border cursor-pointer transition-all duration-200 ${activeComplaint?._id === c._id ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 hover:border-white/20'}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-semibold text-white truncate">{c.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mb-2">{c.complaintId}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 shrink-0">{timeAgo(c.createdAt)}</div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">→ {c.assignedTo}</span>
                  <span className="text-xs text-slate-500">{c.student?.name || 'Anonymous'}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Complaint Detail Pane */}
          <AnimatePresence>
            {activeComplaint && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-3 glass-card rounded-2xl border border-white/10 overflow-hidden">
                {/* Detail header */}
                <div className="p-5 border-b border-white/10 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-white text-lg">{activeComplaint.title}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{activeComplaint.complaintId}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <PriorityBadge priority={activeComplaint.priority} />
                      <StatusBadge status={activeComplaint.status} />
                    </div>
                  </div>
                  <button onClick={() => setActiveComplaint(null)} className="text-slate-500 hover:text-white p-1">
                    <X size={18} />
                  </button>
                </div>

                <div className="p-5 max-h-[600px] overflow-y-auto space-y-5">
                  {/* Student info */}
                  <div className="text-sm space-y-1">
                    <p className="text-slate-400"><span className="text-slate-500">Student: </span>{activeComplaint.student?.name}</p>
                    <p className="text-slate-400"><span className="text-slate-500">Department: </span>{activeComplaint.student?.department || '—'}</p>
                    <p className="text-slate-400"><span className="text-slate-500">Category: </span>{activeComplaint.category}</p>
                    <p className="text-slate-400"><span className="text-slate-500">Assigned to: </span>{activeComplaint.assignedTo}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-slate-300 text-sm leading-relaxed bg-white/3 rounded-xl p-3 border border-white/5">{activeComplaint.description}</p>
                  </div>

                  {/* Update status */}
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map(s => (
                        <button key={s} disabled={updating === activeComplaint._id}
                          onClick={() => updateStatus(activeComplaint._id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${activeComplaint.status === s ? 'bg-purple-500/30 border-purple-500/50 text-purple-300' : 'glass-card border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                          {updating === activeComplaint._id ? <Loader size={12} className="animate-spin" /> : s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <MessageSquare size={12} /> Comments ({activeComplaint.comments?.length || 0})
                    </h4>
                    <div className="space-y-3 mb-3">
                      {activeComplaint.comments?.map((c, i) => (
                        <div key={i} className="bg-white/3 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-white">{c.authorName}</span>
                            <span className="text-xs text-purple-400">{c.authorRole}</span>
                          </div>
                          <p className="text-slate-300 text-sm">{c.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={comment} onChange={e => setComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && addComment()}
                        placeholder="Add a comment..."
                        className="input-glass flex-1 px-3 py-2.5 rounded-xl text-sm" />
                      <button onClick={addComment} disabled={commenting}
                        className="btn-primary px-4 py-2.5 rounded-xl text-white">
                        {commenting ? <Loader size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  {activeComplaint.feedback?.rating && (
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Student Feedback</h4>
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-lg ${s <= activeComplaint.feedback.rating ? 'text-yellow-400' : 'text-slate-700'}`}>★</span>
                        ))}
                      </div>
                      {activeComplaint.feedback.comment && <p className="text-slate-400 text-sm">{activeComplaint.feedback.comment}</p>}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
