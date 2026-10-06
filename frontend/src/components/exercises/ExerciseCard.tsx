import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Calendar, ArrowRight } from 'lucide-react';
import { Exercise } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ExerciseCardProps {
  exercise: Exercise;
}

/**
 * Exercise card
 * Displays summary information and link to detail
 */
export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  // Badge color by difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Difficulty label
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return difficulty;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">
              {exercise.title}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {exercise.description}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {getDifficultyLabel(exercise.difficulty)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Language */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Code2 className="h-4 w-4" />
          <span className="font-medium">{exercise.language}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>
            Created{' '}
            {formatDistanceToNow(new Date(exercise.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Tags */}
        {exercise.tags && exercise.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {exercise.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {exercise.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{exercise.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" variant="default">
          <Link to={`/exercises/${exercise._id}`}>
            View Exercise <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}