const Skeleton = ({ className = '', rounded = 'rounded-md' }) => (
  <div className={`skeleton ${rounded} ${className}`} />
);

export const SkeletonRows = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-3">
        <Skeleton className="h-5 flex-1" />
        <Skeleton className="h-5 flex-1" />
        <Skeleton className="h-5 flex-1" />
        <Skeleton className="h-5 flex-1" />
      </div>
    ))}
  </div>
);

export default Skeleton;
