import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const MemoryCardSkeleton = () => {
  return (
    <Card className="bg-background/60 backdrop-blur-xl border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4 mt-3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
};
