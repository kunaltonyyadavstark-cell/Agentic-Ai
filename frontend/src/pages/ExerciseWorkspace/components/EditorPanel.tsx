// src/pages/ExerciseWorkspace/components/EditorPanel.tsx

import { useState, useCallback } from 'react';
import { Code2 } from 'lucide-react';
import CodeEditor from '@/components/editor/CodeEditor';
import EditorToolbar from './EditorToolbar';
import OutputConsole from './OutputConsole';

interface ConsoleOutput {
  type: 'log' | 'error' | 'success' | 'info';
  message: string;
  timestamp: Date;
}

interface EditorPanelProps {
  code: string;
  language: string;
  starterCode: string;
  onChange: (value: string) => void;
  hasUnsavedChanges?: boolean;
}

export default function EditorPanel({
  code,
  language,
  starterCode,
  onChange,
  hasUnsavedChanges = false,
}: EditorPanelProps) {
  const [outputs, setOutputs] = useState<ConsoleOutput[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  // console.log('🔍 EditorPanel mounted');
  // console.log('📝 Code length:', code.length);
  // console.log('🌐 Language:', language);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
  }, [code]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const handleReset = useCallback(() => {
    onChange(starterCode);
  }, [onChange, starterCode]);

  const handleClearConsole = useCallback(() => {
    setOutputs([]);
  }, []);

  const addOutput = useCallback((type: ConsoleOutput['type'], message: string) => {
    setOutputs((prev) => [
      ...prev,
      { type, message, timestamp: new Date() },
    ]);
    setShowConsole(true);
  }, []);

  // Expose the function so the workspace can add outputs.
  // (esto lo usaremos cuando implementemos "Run Tests")
  (window as any).__addConsoleOutput = addOutput;

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="p-4 border-b bg-card flex-shrink-0">
        <h2 className="font-semibold flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          Code Editor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Write your solution here
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex-shrink-0">
        <EditorToolbar
          language={language}
          onCopy={handleCopy}
          onClear={handleClear}
          onReset={handleReset}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>

      {/* Editor - ALTURA FIJA */}
      <div style={{ height: '600px' }}>
        <CodeEditor
          defaultLanguage={language.toLowerCase()}
          defaultValue={code}
          onChange={onChange}
          height="600px"
          showToolbar={true}
        />
      </div>

      {/* Console */}
      <OutputConsole
        outputs={outputs}
        onClear={handleClearConsole}
        isVisible={showConsole}
      />
    </div>
  );
}