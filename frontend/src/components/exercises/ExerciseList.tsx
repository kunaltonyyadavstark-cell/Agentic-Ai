import { useQuery } from '@tanstack/react-query';
import { exerciseService } from '@/services/exerciseService';
import { ExerciseFilters } from '@/types';
import ExerciseCard from './ExerciseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseListProps {
  filters: ExerciseFilters;
}

/**
 * Exercise list with React Query
 */
export default function ExerciseList({ filters }: ExerciseListProps) {
  const {
    data: exercises,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => exerciseService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load exercises.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (!exercises || exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileX className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {filters.search || filters.language || filters.difficulty || filters.category
            ? 'Try adjusting your filters'
            : 'No exercises available yet'}
        </p>
      </div>
    );
  }

  // Success state
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise._id} exercise={exercise} />
      ))}
    </div>
  );
}