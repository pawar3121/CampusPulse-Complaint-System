import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, X, AlertTriangle, Wifi, Trash2, Lightbulb, ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Common/Navbar';

const CATEGORIES = ['Infrastructure', 'Academic', 'Administrative', 'Technical', 'Safety', 'Hostel', 'Other'];

const HIGH_KEYWORDS = ['fire', 'electric', 'emergency', 'accident', 'injury', 'danger', 'urgent', 'flood', 'collapse'];
const MED_KEYWORDS = ['wifi', 'lab', 'system', 'computer', 'projector', 'internet', 'network', 'software', 'hardware'];
const LOW_KEYWORDS = ['cleaning', 'fan', 'classroom', 'bench', 'chair', 'desk', 'board', 'light', 'window', 'toilet'];

const detectPriority = (text) => {
  const lower = text.toLowerCase();
  if (HIGH_KEYWORDS.some(k => lower.includes(k))) return 'high';
  if (MED_KEYWORDS.some(k => lower.includes(k))) return 'medium';
  return 'low';
};

const PRIORITY_INFO = {
  high: { label: 'High Priority', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: '🚨', authority: 'Principal', eta: '4 hours' },
  medium: { label: 'Medium Priority', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: '⚠️', authority: 'HOD', eta: '48 hours' },
  low: { label: 'Low Priority', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: '✅', authority: 'Class Coordinator', eta: '1 week' },
};

const SUGGESTIONS = [
  'Fire hazard near electrical panel', 'Emergency — water flooding corridor',
  'WiFi not working in Block B', 'Lab projector broken since Monday',
  'Computer systems crashing in lab 4', 'Internet very slow in library',
  'Fan not working in Classroom 201', 'Classroom benches are broken',
  'Washroom cleaning required urgently', 'Whiteboard markers missing in room 105',
];

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', isAnonymous: false });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [detectedPriority, setDetectedPriority] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);

  // Live priority detection
  useEffect(() => {
    const text = `${form.title} ${form.description}`;
    if (text.trim().length > 5) {
      setDetectedPriority(detectPriority(text));
    } else {
      setDetectedPriority(null);
    }
  }, [form.title, form.description]);

  // Auto-suggestions for title
  const handleTitleChange = (val) => {
    setForm({ ...form, title: val });
    if (val.length > 2) {
      const filtered = SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered);
      setShowSugg(filtered.length > 0);
    } else {
      setShowSugg(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await axios.post('/complaints', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Complaint submitted! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const pInfo = detectedPriority ? PRIORITY_INFO[detectedPriority] : null;

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Submit a Complaint</h1>
          <p className="text-slate-400">Our AI automatically analyzes and prioritizes your complaint.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-8 border border-white/10 space-y-6"
        >
          {/* Title with suggestions */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">Complaint Title <span className="text-red-400">*</span></label>
            <input
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSugg(false), 200)}
              placeholder="Brief summary of your issue..."
              className="input-glass w-full px-4 py-3 rounded-xl text-sm"
            />
            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSugg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-1 w-full glass-card rounded-xl border border-white/10 z-20 overflow-hidden shadow-2xl"
                >
                  {suggestions.slice(0, 5).map((s, i) => (
                    <button key={i} type="button"
                      onClick={() => { setForm({ ...form, title: s }); setShowSugg(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 flex items-center gap-2 transition-colors">
                      <Lightbulb size={14} className="text-yellow-400 shrink-0" />
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    form.category === cat
                      ? 'bg-purple-500/30 border-purple-500/60 text-purple-300'
                      : 'glass-card border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description <span className="text-red-400">*</span></label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={5}
              placeholder="Describe the issue in detail. Include location, time, and any relevant info..."
              className="input-glass w-full px-4 py-3 rounded-xl text-sm resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">{form.description.length}/2000 characters</p>
          </div>

          {/* Live Priority Preview */}
          <AnimatePresence>
            {pInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className={`rounded-xl p-4 border ${pInfo.bg}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pInfo.icon}</span>
                  <div>
                    <p className={`font-semibold ${pInfo.color}`}>{pInfo.label} Detected</p>
                    <p className="text-slate-400 text-sm">Will be routed to: <span className="text-white font-medium">{pInfo.authority}</span> · ETA: <span className="font-mono text-xs">{pInfo.eta}</span></p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Attach Image (optional)</label>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <img src={preview} alt="preview" className="w-full h-48 object-cover" />
                <button type="button" onClick={() => { setImage(null); setPreview(''); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors">
                  <X size={14} className="text-white" />
                </button>
              </div>
            ) : (
              <div onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group">
                <Upload size={24} className="mx-auto text-slate-500 group-hover:text-purple-400 mb-2 transition-colors" />
                <p className="text-slate-500 text-sm group-hover:text-slate-400">Click to upload image (max 5MB)</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            )}
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center gap-3">
            <button type="button"
              onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}
              className={`relative w-10 h-5 rounded-full transition-all duration-300 ${form.isAnonymous ? 'bg-purple-500' : 'bg-slate-700'}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${form.isAnonymous ? 'translate-x-5' : ''}`} />
            </button>
            <label className="text-sm text-slate-400 cursor-pointer" onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}>
              Submit anonymously
            </label>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="btn-primary w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 text-base"
          >
            {loading ? <><Loader size={18} className="animate-spin" /> Submitting...</> : <><Send size={18} /> Submit Complaint</>}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
