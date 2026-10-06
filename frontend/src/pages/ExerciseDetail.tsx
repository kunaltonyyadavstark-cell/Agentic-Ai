import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { exerciseService } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import CodeEditor from '@/components/editor/CodeEditor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Code2, 
  Calendar, 
  Sparkles, 
  Search, 
  Lightbulb,
  CheckCircle2,
  Edit,
  Trash2,
  Zap
} from 'lucide-react';
import { useIsAuthenticated } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

/**
 * Exercise Detail Page
 */
export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const {
    data: exercise,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['exercise', id],
    queryFn: () => exerciseService.getById(id!),
    enabled: !!id,
  });

  // AI handlers
  const handleGenerateSolution = () => {
    toast.info('Generating solution with AI...', {
      description: 'This feature will be available soon'
    });
  };

  const handleAnalyzeCode = () => {
    toast.info('Analyzing code...', {
      description: 'This feature will be available soon'
    });
  };

  const handleExplainConcept = () => {
    toast.info('Explaining concept...', {
      description: 'This feature will be available soon'
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;
    
    try {
      await exerciseService.delete(id!);
      toast.success('Exercise deleted successfully');
      navigate('/exercises');
    } catch (error) {
      toast.error('Failed to delete exercise');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // Error state
  if (isError || !exercise) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load exercise.
          <Button variant="outline" size="sm" className="ml-4" onClick={() => navigate('/exercises')}>
            Back to exercises
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Helpers
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/exercises')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to exercises
      </Button>

      {/* Exercise header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{exercise.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Code2 className="h-4 w-4" />
                <span>{exercise.language}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {formatDistanceToNow(new Date(exercise.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(exercise.difficulty)}>
              {getDifficultyLabel(exercise.difficulty)}
            </Badge>
            {isAuthenticated && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/exercises/${id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 🚀 PRIMARY BUTTON - ACADEMY MODE */}
        <Button
          onClick={() => navigate(`/exercises/${id}/workspace`)}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Enter Academy Workspace
          <Zap className="ml-2 h-5 w-5" />
        </Button>

        {/* Tags */}
        {exercise.tags && exercise.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {exercise.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {exercise.description}
          </p>
        </CardContent>
      </Card>

      {/* Test Cases */}
      {exercise.testCases && exercise.testCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
            <CardDescription>
              Your solution must pass these test cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercise.testCases.map((testCase, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Test Case #{index + 1}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Input:</span>
                    <pre className="mt-1 p-2 bg-white dark:bg-gray-950 rounded border overflow-x-auto">
                      {JSON.stringify(testCase.input, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="font-medium">Expected output:</span>
                    <pre className="mt-1 p-2 bg-white dark:bg-gray-950 rounded border overflow-x-auto">
                      {JSON.stringify(testCase.expectedOutput, null, 2)}
                    </pre>
                  </div>
                </div>
                {testCase.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testCase.description}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hints */}
      {exercise.hints && exercise.hints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hints</CardTitle>
            <CardDescription>
              A few ideas to help you solve the exercise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {exercise.hints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* AI Assistance */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>AI Assistance</CardTitle>
            <CardDescription>
              Use Gemini 2.0 to get help with this exercise
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={handleGenerateSolution} variant="default">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Solution
            </Button>
            <Button onClick={handleAnalyzeCode} variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Analyze My Code
            </Button>
            <Button onClick={handleExplainConcept} variant="outline">
              <Lightbulb className="mr-2 h-4 w-4" />
              Explain Concept
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 🚀 SECONDARY BUTTON - ACADEMY MODE */}
      {isAuthenticated && (
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Want a complete learning experience?
            </CardTitle>
            <CardDescription>
              Access the Academy Workspace with an AI tutor, interactive flowcharts, real-time analysis, and much more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate(`/exercises/${id}/workspace`)}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Zap className="mr-2 h-5 w-5" />
              Open Academy Workspace
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Code Editor Preview */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Editor Preview</CardTitle>
            <CardDescription>
              For the full interactive experience, use the Academy Workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeEditor
              defaultLanguage={exercise.language}
              defaultValue={exercise.solution || `// Write your ${exercise.language} solution here\n`}
              height="500px"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}