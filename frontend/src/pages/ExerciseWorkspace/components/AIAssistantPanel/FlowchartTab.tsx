// src/pages/ExerciseWorkspace/components/AIAssistantPanel/FlowchartTab.tsx

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import mermaid from 'mermaid';
import { Loader2, Download, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aiService } from '@/services/aiService';

interface FlowchartTabProps {
  exerciseId: string;
}

export default function FlowchartTab({ exerciseId }: FlowchartTabProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['exercise-flowchart', exerciseId],
    queryFn: () => aiService.generateFlowchart(exerciseId),
    staleTime: 30 * 60 * 1000, // 30 minutes (does not change frequently)
  })as any;

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#2563eb',
        lineColor: '#60a5fa',
        secondaryColor: '#8b5cf6',
        tertiaryColor: '#6366f1',
      },
    });
  }, []);

  // Render Mermaid diagram when data is available
  useEffect(() => {
    if (data?.flowchart?.mermaidCode && mermaidRef.current && !isRendered) {
      const renderDiagram = async () => {
        try {
          const { svg } = await mermaid.render(
            `mermaid-${exerciseId}`,
            data.flowchart.mermaidCode
          );
          
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
            setIsRendered(true);
          }
        } catch (err) {
          console.error('Failed to render Mermaid diagram:', err);
        }
      };

      renderDiagram();
    }
  }, [data, exerciseId, isRendered]);

  const handleDownload = () => {
    if (!mermaidRef.current) return;

    const svgElement = mermaidRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowchart-${exerciseId}.svg`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleFullscreen = () => {
    if (mermaidRef.current) {
      mermaidRef.current.requestFullscreen?.();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Generating flowchart with AI...</p>
        <p className="text-sm mt-2">Creating visual algorithm diagram</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to generate flowchart. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.flowchart) {
    return null;
  }

  const { flowchart } = data;

  return (
    <div className="space-y-4">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Algorithm Flowchart</CardTitle>
          <CardDescription>{flowchart.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download SVG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mermaid Diagram */}
      <Card>
        <CardContent className="pt-6">
          <div
            ref={mermaidRef}
            className="flex items-center justify-center p-4 bg-slate-900 rounded-lg overflow-auto min-h-[400px]"
          />
        </CardContent>
      </Card>

      {/* Steps Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Step-by-Step Flow</CardTitle>
          <CardDescription>Understanding the algorithm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flowchart.steps.map((step: string, index: number) => (
              <div
                key={index}
                className="flex gap-3 items-start"
              >
                <Badge variant="outline" className="mt-0.5">
                  {index + 1}
                </Badge>
                <p className="text-sm text-muted-foreground flex-1">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}