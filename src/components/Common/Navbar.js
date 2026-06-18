import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, Menu, X, Sun, Moon, User, LayoutDashboard, PlusCircle, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = user?.role === 'admin'
    ? [{ label: 'Dashboard', path: '/admin', icon: <Shield size={16} /> }]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { label: 'Submit Complaint', path: '/submit', icon: <PlusCircle size={16} /> },
      ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="glass-card border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
              <span className="text-white font-display font-bold text-sm">CP</span>
            </div>
            <span className="font-display font-bold text-lg gradient-text-blue hidden sm:block">CampusPulse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>

            {/* Profile dropdown */}
            {user && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card hover:bg-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 hidden sm:block font-medium">{user.name?.split(' ')[0]}</span>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 glass-card rounded-xl border border-white/10 overflow-hidden shadow-xl"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                        <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {user.role === 'admin' ? '🛡 Admin' : '🎓 Student'}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-b border-white/10 px-6 py-4"
          >
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-2 py-3 text-slate-300 hover:text-white">
                  {link.icon}
                  {link.label}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
