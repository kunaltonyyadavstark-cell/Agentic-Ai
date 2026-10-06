// src/pages/CreateExercise.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { exerciseService } from '../services/exerciseService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'];

export default function CreateExercise() {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState('algorithms');
  const [language, setLanguage] = useState('Python');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [solution, setSolution] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [testCases, setTestCases] = useState([
    { input: '', expectedOutput: '', description: '' }
  ]);

  // Mutation to create exercise
  const createMutation = useMutation({
    mutationFn: (data: any) => exerciseService.create(data),
    onSuccess: (data) => {
      toast.success('Exercise created successfully!');
      navigate(`/exercises/${data._id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create exercise');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title || !description || tags.length === 0 || testCases.length === 0 || !solution) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Parse test cases
    const parsedTestCases = testCases.map(tc => ({
      input: JSON.parse(tc.input || '[]'),
      expectedOutput: JSON.parse(tc.expectedOutput || 'null'),
      description: tc.description || undefined,
    }));

    const data = {
      title,
      description,
      difficulty,
      category,
      language,
      tags,
      testCases: parsedTestCases,
      solution,
      starterCode: starterCode || undefined,
      hints: hints.filter(h => h.trim() !== ''),
    };

    createMutation.mutate(data);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', description: '' }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (index: number, field: string, value: string) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const addHint = () => {
    setHints([...hints, '']);
  };

  const removeHint = (index: number) => {
    setHints(hints.filter((_, i) => i !== index));
  };

  const updateHint = (index: number, value: string) => {
    const updated = [...hints];
    updated[index] = value;
    setHints(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/exercises')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to exercises
        </Button>
        <h1 className="text-3xl font-bold mt-2">Create Exercise</h1>
        <p className="text-muted-foreground mt-1">Add a new exercise to the platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Sum of Two Numbers"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the problem..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Difficulty *</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language *</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arrays">Arrays</SelectItem>
                    <SelectItem value="strings">Strings</SelectItem>
                    <SelectItem value="loops">Loops</SelectItem>
                    <SelectItem value="data-structures">Data Structures</SelectItem>
                    <SelectItem value="algorithms">Algorithms</SelectItem>
                    <SelectItem value="logic-math">Logic & Math</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test cases */}
        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
            <CardDescription>Use JSON format. e.g. [1, 2] for input, 3 for output</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testCases.map((tc, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Case #{index + 1}</h4>
                  {testCases.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTestCase(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Input (JSON)</Label>
                    <Textarea
                      placeholder='[1, 2]'
                      rows={2}
                      value={tc.input}
                      onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected output</Label>
                    <Textarea
                      placeholder='3'
                      rows={2}
                      value={tc.expectedOutput}
                      onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input
                    placeholder="e.g. Basic addition"
                    value={tc.description}
                    onChange={(e) => updateTestCase(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addTestCase} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add test case
            </Button>
          </CardContent>
        </Card>

        {/* Code */}
        <Card>
          <CardHeader>
            <CardTitle>Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="solution">Solution * (full code)</Label>
              <Textarea
                id="solution"
                placeholder="def sum(a, b):&#10;    return a + b"
                rows={10}
                className="font-mono text-sm"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="starterCode">Starter code (optional)</Label>
              <Textarea
                id="starterCode"
                placeholder="def sum(a, b):&#10;    # Write your code here&#10;    pass"
                rows={8}
                className="font-mono text-sm"
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Hints */}
        <Card>
          <CardHeader>
            <CardTitle>Hints (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hints.map((hint, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Hint #${index + 1}`}
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHint(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addHint} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add hint
            </Button>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/exercises')}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>Creating...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Exercise
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}