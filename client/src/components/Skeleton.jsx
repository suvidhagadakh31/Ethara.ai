export const SkeletonBlock = ({ className = '' }) => <div className={`skeleton ${className}`} />;

export const StatCardSkeleton = () => (
  <div className="card p-5 space-y-3">
    <div className="flex justify-between"><SkeletonBlock className="h-4 w-20" /><SkeletonBlock className="h-10 w-10 rounded-xl" /></div>
    <SkeletonBlock className="h-8 w-16" />
  </div>
);

export const CardSkeleton = () => (
  <div className="card p-5 space-y-4">
    <SkeletonBlock className="h-5 w-36" />
    <SkeletonBlock className="h-4 w-full" />
    <SkeletonBlock className="h-4 w-2/3" />
    <div className="flex justify-between pt-2"><SkeletonBlock className="h-6 w-16 rounded-full" /><SkeletonBlock className="h-4 w-20" /></div>
  </div>
);

export const RowSkeleton = () => (
  <div className="card p-4 flex items-center justify-between">
    <div className="space-y-2 flex-1"><SkeletonBlock className="h-5 w-48" /><SkeletonBlock className="h-3 w-32" /></div>
    <SkeletonBlock className="h-6 w-20 rounded-full" />
  </div>
);
