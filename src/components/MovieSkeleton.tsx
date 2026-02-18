import { Skeleton } from '@/components/ui/skeleton';

const MovieSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-card border border-border">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const MovieSkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: 20 }).map((_, i) => (
      <MovieSkeleton key={i} />
    ))}
  </div>
);

export default MovieSkeleton;
