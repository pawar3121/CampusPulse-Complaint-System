import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Loader } from 'lucide-react';

const STEPS = [
  { key: 'submitted', label: 'Submitted', icon: CheckCircle },
  { key: 'assigned', label: 'Assigned', icon: Clock },
  { key: 'in_progress', label: 'In Progress', icon: Loader },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle },
];

const STATUS_INDEX = { submitted: 0, assigned: 1, in_progress: 2, resolved: 3 };

const ComplaintProgress = ({ status }) => {
  const currentIdx = STATUS_INDEX[status] ?? 0;

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 z-0" />
        {/* Filled progress */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 progress-bar z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 z-10">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-purple-500 to-blue-600 border-purple-400 shadow-lg shadow-purple-500/30'
                    : 'bg-slate-800 border-slate-600'
                } ${isCurrent ? 'ring-4 ring-purple-500/20' : ''}`}
              >
                {isCurrent && idx !== 3 ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                    <Loader size={16} className="text-white" />
                  </motion.div>
                ) : (
                  <Icon size={16} className={isCompleted ? 'text-white' : 'text-slate-500'} />
                )}
              </motion.div>
              <span className={`text-xs font-medium ${isCompleted ? 'text-slate-300' : 'text-slate-500'} hidden sm:block`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintProgress;
