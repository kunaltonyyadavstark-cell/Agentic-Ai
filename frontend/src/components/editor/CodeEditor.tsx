// src/components/editor/CodeEditor.tsx

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Copy, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
  defaultLanguage?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;  // 👈 ADDED
  onRun?: (code: string, language: string) => void;
  height?: string;
  showToolbar?: boolean;  // 👈 ADDED
}

/**
 * Monaco Code Editor Component
 * Code editor with syntax highlighting and autocompletion
 */
export default function CodeEditor({
  defaultLanguage = 'javascript',
  defaultValue = '// Write your code here\n',
  onChange,
  onRun,
  height = '400px',
  showToolbar = true,
}: CodeEditorProps) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(defaultValue);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  // When the editor is mounted
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  // When code changes externally
  useEffect(() => {
    setCode(defaultValue);
  }, [defaultValue]);

  // When user types
  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  // Run code
  const handleRun = () => {
    if (onRun) {
      onRun(code, language);
    } else {
      toast.info('Running code...', {
        description: 'This feature will be available soon'
      });
    }
  };

  // Copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear code
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all code?')) {
      setCode('');
      if (onChange) {
        onChange('');
      }
      toast.info('Code cleared');
    }
  };

  const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
  ];

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar - Only shown if showToolbar is true */}
      {showToolbar && (
        <div className="flex items-center justify-between p-3 border-b bg-muted">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
            {onRun && (
              <Button variant="default" size="sm" onClick={handleRun}>
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Editor */}
      <Editor
        height={height}
        language={language}
        value={code}
        onChange={handleEditorChange}  // 👈 MODIFICADO
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}