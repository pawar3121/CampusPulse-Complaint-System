import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, MessageSquare, Star, Send, Loader, Building, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Common/Navbar';
import PriorityBadge, { StatusBadge } from '../components/Common/PriorityBadge';
import ComplaintProgress from '../components/Common/ComplaintProgress';
import { useAuth } from '../context/AuthContext';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/complaints/${id}`);
        setComplaint(data.complaint);
      } catch {
        toast.error('Complaint not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const submitFeedback = async () => {
    if (!rating) return toast.error('Please select a rating');
    setFeedbackLoading(true);
    try {
      const { data } = await axios.post(`/complaints/${id}/feedback`, { rating, comment: feedbackText });
      setComplaint(data.complaint);
      toast.success('Feedback submitted! Thank you 🙏');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full border-4 border-purple-500 border-t-transparent w-12 h-12" />
        </div>
      </div>
    );
  }

  if (!complaint) return null;

  const isOwner = complaint.student?._id === user?._id || complaint.student === user?._id;
  const canFeedback = complaint.status === 'resolved' && isOwner && !complaint.feedback?.rating;

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Main card */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold text-white mb-1">{complaint.title}</h1>
                <p className="text-xs text-slate-500 font-mono">{complaint.complaintId}</p>
              </div>
              <PriorityBadge priority={complaint.priority} />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <StatusBadge status={complaint.status} />
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">{complaint.category}</span>
              {complaint.isAnonymous && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400 border border-slate-500/20">Anonymous</span>
              )}
            </div>

            {/* Progress */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Complaint Progress</h3>
              <ComplaintProgress status={complaint.status} />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-sm">
                <Building size={14} className="text-slate-500" />
                <span className="text-slate-400">Routed to:</span>
                <span className="text-white font-medium">{complaint.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-slate-500" />
                <span className="text-slate-400">Submitted:</span>
                <span className="text-white text-xs">{formatDate(complaint.createdAt)}</span>
              </div>
              {complaint.estimatedResolution && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-slate-500" />
                  <span className="text-slate-400">ETA:</span>
                  <span className="text-white text-xs">{formatDate(complaint.estimatedResolution)}</span>
                </div>
              )}
              {complaint.resolvedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-emerald-500" />
                  <span className="text-slate-400">Resolved:</span>
                  <span className="text-emerald-300 text-xs">{formatDate(complaint.resolvedAt)}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Description</h3>
              <p className="text-slate-300 text-sm leading-relaxed bg-white/3 rounded-xl p-4 border border-white/5">{complaint.description}</p>
            </div>

            {/* Image */}
            {complaint.image && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Attached Image</h3>
                <img src={`http://localhost:5000${complaint.image}`} alt="complaint" className="rounded-xl max-h-64 w-full object-cover border border-white/10" />
              </div>
            )}
          </div>

          {/* Comments */}
          {complaint.comments?.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-purple-400" />
                Admin Comments ({complaint.comments.length})
              </h3>
              <div className="space-y-4">
                {complaint.comments.map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {c.authorName?.charAt(0)}
                    </div>
                    <div className="flex-1 bg-white/4 rounded-xl p-3 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{c.authorName}</span>
                        <span className="text-xs text-purple-400 capitalize">{c.authorRole}</span>
                      </div>
                      <p className="text-slate-300 text-sm">{c.text}</p>
                      <p className="text-xs text-slate-600 mt-1">{formatDate(c.createdAt)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback section */}
          {canFeedback && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-6 border border-emerald-500/20">
              <h3 className="font-display font-semibold text-white mb-1 flex items-center gap-2">
                <Star size={18} className="text-yellow-400" /> Rate this resolution
              </h3>
              <p className="text-slate-400 text-sm mb-4">How satisfied are you with how your complaint was handled?</p>

              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button key={star} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-all duration-150">
                    <Star size={28} className={`${(hover || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} transition-colors`} />
                  </motion.button>
                ))}
                {rating > 0 && <span className="ml-2 text-sm text-slate-400 self-center">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}</span>}
              </div>

              <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} rows={3}
                placeholder="Additional comments (optional)..."
                className="input-glass w-full px-4 py-3 rounded-xl text-sm resize-none mb-4" />

              <motion.button onClick={submitFeedback} disabled={feedbackLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2">
                {feedbackLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                Submit Feedback
              </motion.button>
            </motion.div>
          )}

          {/* Show existing feedback */}
          {complaint.feedback?.rating && (
            <div className="glass-card rounded-2xl p-5 border border-yellow-500/20">
              <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2"><Star size={14} className="text-yellow-400" /> Your Feedback</h3>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={18} className={s <= complaint.feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />)}
              </div>
              {complaint.feedback.comment && <p className="text-slate-300 text-sm">{complaint.feedback.comment}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
