import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const configs = {
    high: { label: 'High', icon: <AlertTriangle size={12} />, className: 'priority-high' },
    medium: { label: 'Medium', icon: <AlertCircle size={12} />, className: 'priority-medium' },
    low: { label: 'Low', icon: <CheckCircle size={12} />, className: 'priority-low' },
  };
  const config = configs[priority] || configs.low;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const configs = {
    submitted: { label: 'Submitted', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
    assigned: { label: 'Assigned', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    in_progress: { label: 'In Progress', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    resolved: { label: 'Resolved', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  };
  const config = configs[status] || configs.submitted;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {config.label}
    </span>
  );
};

export default PriorityBadge;
