// src/pages/ExerciseWorkspace/components/AIAssistantPanel/ExplanationTab.tsx

import { useQuery } from '@tanstack/react-query';
import { Lightbulb, Clock, CheckCircle2, BookOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { aiService } from '@/services/aiService';

interface ExplanationTabProps {
  exerciseId: string;
}

export default function ExplanationTab({ exerciseId }: ExplanationTabProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['exercise-analysis', exerciseId],
    queryFn: () => aiService.analyzeExercise(exerciseId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })as any;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Analyzing exercise with AI...</p>
        <p className="text-sm mt-2">This may take a few seconds</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to analyze exercise. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.analysis) {
    return null;
  }

  const { analysis } = data;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>

      {/* Key Concepts & Time */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Key Concepts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Concepts</CardTitle>
            <CardDescription>What you need to know</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.keyConcepts.map((concept: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {concept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Estimate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Time Estimate</CardTitle>
            <CardDescription>Expected completion time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{analysis.estimatedTime}</span>
              <span className="text-muted-foreground">minutes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prerequisites */}
      {analysis.prerequisites && analysis.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Prerequisites
            </CardTitle>
            <CardDescription>What you should know before starting</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.prerequisites.map((prereq: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step-by-Step Roadmap</CardTitle>
          <CardDescription>Follow these steps to solve the exercise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.roadmap.map((step: any, index: number) => (
              <div
                key={step.id}
                className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Badge */}
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className={
            analysis.difficulty === 'beginner'
              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
              : analysis.difficulty === 'intermediate'
              ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
              : 'bg-red-500/10 text-red-700 dark:text-red-400'
          }
        >
          Level: {analysis.difficulty}
        </Badge>
      </div>
    </div>
  );
}