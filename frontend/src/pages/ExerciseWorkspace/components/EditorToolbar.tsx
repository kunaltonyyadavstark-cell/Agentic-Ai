// src/pages/ExerciseWorkspace/components/EditorToolbar.tsx

import { Copy, RotateCcw, Trash2,  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface EditorToolbarProps {
  language: string;
  onCopy: () => void;
  onClear: () => void;
  onReset: () => void;
  hasUnsavedChanges?: boolean;
}

export default function EditorToolbar({
  language,
  onCopy,
  onClear,
  onReset,
  hasUnsavedChanges = false,
}: EditorToolbarProps) {
  
  const handleCopy = () => {
    onCopy();
    toast.success('Code copied to clipboard');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all code?')) {
      onClear();
      toast.info('Code cleared');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to the starter code?')) {
      onReset();
      toast.info('Code reset');
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b bg-muted/30">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono">
          {language}
        </Badge>
        {hasUnsavedChanges && (
          <Badge variant="secondary" className="text-xs">
            <span className="mr-1">●</span> Unsaved
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          title="Copy code"
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          title="Reset to starter code"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          title="Clear all"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}