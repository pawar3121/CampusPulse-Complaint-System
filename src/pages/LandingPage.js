import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, BarChart3, Users, CheckCircle, Star, ChevronDown, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const FloatingCard = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    style={{ animation: `float ${5 + delay}s ease-in-out infinite` }}
    className={`glass-card rounded-2xl p-4 ${className}`}
  >
    {children}
  </motion.div>
);

const Feature = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -4 }}
    className="glass-card rounded-2xl p-6 group cursor-default"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <span className="text-purple-400">{icon}</span>
    </div>
    <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Stat = ({ value, label, icon }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-3xl font-display font-bold gradient-text mb-1">{value}</div>
    <div className="text-slate-400 text-sm flex items-center justify-center gap-1">{icon}{label}</div>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen gradient-bg overflow-x-hidden relative">
      {/* Mesh gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-display font-bold text-sm">CP</span>
            </div>
            <span className="font-display font-bold text-lg gradient-text-blue">CampusPulse</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                Sign In
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-lg">
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-purple-500/20 text-purple-300 text-sm font-medium mb-8"
              >
                <Zap size={14} className="text-yellow-400" />
                AI-Powered Complaint Management
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
              >
                Your Campus,
                <br />
                <span className="gradient-text">Heard Louder.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg"
              >
                Submit complaints with intelligent auto-prioritization. Our system routes issues to the right authority — instantly, transparently, efficiently.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary px-7 py-3.5 rounded-xl font-semibold text-white flex items-center gap-2 shadow-xl"
                  >
                    Start For Free
                    <ArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-7 py-3.5 rounded-xl font-semibold text-slate-300 glass-card border border-white/10 hover:border-white/20 flex items-center gap-2 transition-all"
                  >
                    <Shield size={18} />
                    Admin Login
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 flex items-center gap-6 text-sm text-slate-500"
              >
                {['No setup required', 'Real-time tracking', 'Auto-prioritization'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-400" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Floating UI mockup */}
            <div className="relative h-[500px] hidden lg:block">
              <FloatingCard className="absolute top-0 right-8 w-72" delay={0.2}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs font-semibold text-red-300 uppercase tracking-wider">High Priority</span>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">Electrical hazard in Lab 3</h4>
                <p className="text-slate-400 text-xs mb-3">Exposed wiring near workstations poses safety risk...</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">→ Principal</span>
                  <span className="text-xs text-emerald-400 font-mono">ETA: 4h</span>
                </div>
              </FloatingCard>

              <FloatingCard className="absolute top-32 left-0 w-64" delay={0.4}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Resolution Rate</p>
                    <p className="text-lg font-bold text-white font-display">94.2%</p>
                  </div>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="h-1.5 rounded-full progress-bar"
                  />
                </div>
              </FloatingCard>

              <FloatingCard className="absolute bottom-20 right-4 w-68" delay={0.6}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-white">Complaint Resolved</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">WiFi issue in Block B fixed in 36 hours</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />)}
                </div>
              </FloatingCard>

              <FloatingCard className="absolute bottom-8 left-8 w-56" delay={0.8}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">R</div>
                  <div>
                    <p className="text-sm text-white font-medium">Ravi Kumar</p>
                    <p className="text-xs text-slate-400">Submitted 2 mins ago</p>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600">
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <Stat value="1,200+" label="Complaints Resolved" icon={<CheckCircle size={14} className="text-emerald-400" />} />
          <Stat value="94%" label="Resolution Rate" icon={<TrendingUp size={14} className="text-blue-400" />} />
          <Stat value="< 4h" label="Avg High Priority" icon={<Clock size={14} className="text-red-400" />} />
          <Stat value="500+" label="Active Students" icon={<Users size={14} className="text-purple-400" />} />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">Everything your campus needs</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">From smart routing to real-time updates — CampusPulse covers the entire lifecycle of every complaint.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature delay={0} icon={<Zap size={24} />} title="AI-Smart Prioritization"
              desc="Keyword detection instantly classifies complaints as High, Medium, or Low — no manual triage needed." />
            <Feature delay={0.1} icon={<Shield size={24} />} title="Authority Routing"
              desc="Issues automatically reach the right person — Principal, HOD, or Class Coordinator — based on urgency." />
            <Feature delay={0.2} icon={<BarChart3 size={24} />} title="Analytics Dashboard"
              desc="Admins get real-time charts on complaint trends, resolution rates, and category breakdowns." />
            <Feature delay={0.3} icon={<Clock size={24} />} title="Resolution ETAs"
              desc="Each complaint shows an estimated resolution time so students always know what to expect." />
            <Feature delay={0.4} icon={<Users size={24} />} title="Real-time Updates"
              desc="Socket.io pushes live status changes directly to students — no refreshing needed." />
            <Feature delay={0.5} icon={<Star size={24} />} title="Feedback System"
              desc="Students rate resolved complaints, giving admins visibility into satisfaction and service quality." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 border border-purple-500/20 glow-purple"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to be heard?</h2>
            <p className="text-slate-400 mb-8 text-lg">Join hundreds of students who've already resolved their campus issues with CampusPulse.</p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-10 py-4 rounded-xl font-semibold text-white text-lg shadow-2xl"
              >
                Create Free Account →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-slate-600 text-sm">
        <p>© 2024 CampusPulse. Built for students, by students. 🎓</p>
      </footer>
    </div>
  );
};

export default LandingPage;
