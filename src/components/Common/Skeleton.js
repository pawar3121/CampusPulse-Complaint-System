import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-card rounded-2xl p-5 space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl skeleton" />
      <div className="flex-1 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 skeleton rounded" />
      <div className="h-3 skeleton rounded w-5/6" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 skeleton rounded-full" />
      <div className="h-6 w-20 skeleton rounded-full" />
    </div>
  </div>
);

export const StatSkeleton = () => (
  <div className="glass-card rounded-2xl p-5 space-y-3 animate-pulse">
    <div className="h-3 skeleton rounded w-1/2" />
    <div className="h-8 skeleton rounded w-1/3" />
    <div className="h-3 skeleton rounded w-3/4" />
  </div>
);

export default CardSkeleton;
