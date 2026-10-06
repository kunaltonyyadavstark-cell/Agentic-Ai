import { Button } from '@/components/ui/button';
import { ExerciseCategory } from '@/types';
import { 
  ListOrdered, 
  Type, 
  RepeatIcon, 
  Database, 
  Binary, 
  Calculator 
} from 'lucide-react';

const categories: Array<{ value: ExerciseCategory; label: string; icon: React.ReactNode }> = [
  { value: 'arrays', label: 'Arrays', icon: <ListOrdered className="h-4 w-4" /> },
  { value: 'strings', label: 'Strings', icon: <Type className="h-4 w-4" /> },
  { value: 'loops', label: 'Loops', icon: <RepeatIcon className="h-4 w-4" /> },
  { value: 'data-structures', label: 'Data Structures', icon: <Database className="h-4 w-4" /> },
  { value: 'algorithms', label: 'Algorithms', icon: <Binary className="h-4 w-4" /> },
  { value: 'logic-math', label: 'Logic & Math', icon: <Calculator className="h-4 w-4" /> },
];

interface CategoryFilterProps {
  selected?: ExerciseCategory;
  onChange: (category: ExerciseCategory | undefined) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const handleCategoryClick = (category: ExerciseCategory) => {
    // If already selected, deselect it
    if (selected === category) {
      onChange(undefined);
    } else {
      onChange(category);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Category</h3>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selected === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryClick(cat.value)}
            className="justify-start"
          >
            {cat.icon}
            <span className="ml-2">{cat.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}