import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div className="fixed inset-0 gradient-bg flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 mx-auto mb-6 relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-400" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">CampusPulse</h2>
        <p className="text-slate-400 text-sm">Loading your dashboard...</p>
      </motion.div>
    </div>
  </div>
);

export default LoadingScreen;
