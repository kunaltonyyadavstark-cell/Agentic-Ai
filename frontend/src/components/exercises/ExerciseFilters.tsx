import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Difficulty, ExerciseFilters as FilterType } from '@/types';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';

interface ExerciseFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

/**
 * Exercise filters
 * Includes: search, language, difficulty, and category
 */
export default function ExerciseFilters({ filters, onFilterChange }: ExerciseFiltersProps) {
  const handleLanguageChange = (value: string) => {
    onFilterChange({
      ...filters,
      language: value === 'all' ? undefined : value,
      page: 1,
    });
  };

  const handleDifficultyChange = (value: string) => {
    onFilterChange({
      ...filters,
      difficulty: value === 'all' ? undefined : (value as Difficulty),
      page: 1,
    });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({
      ...filters,
      search: search || undefined,
      page: 1,
    });
  };

  const handleCategoryChange = (category: any) => {
    onFilterChange({
      ...filters,
      category,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      page: 1,
      limit: 12,
    });
  };

  const hasActiveFilters = 
    filters.language || 
    filters.difficulty || 
    filters.search || 
    filters.category;

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-950 rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* SearchBar con debounce */}
      <div className="space-y-2">
        <Label>Search</Label>
        <SearchBar
          value={filters.search || ''}
          onChange={handleSearchChange}
          placeholder="Search by title or description..."
        />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selected={filters.category}
        onChange={handleCategoryChange}
      />

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select
          value={filters.language || 'all'}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="All languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="csharp">C#</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
          value={filters.difficulty || 'all'}
          onValueChange={handleDifficultyChange}
        >
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="All difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}