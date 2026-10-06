import mongoose, { Schema, Model } from 'mongoose';
import type { IExercise, DifficultyLevel, ProgrammingLanguage, ExerciseCategory } from '../types';

/**
 * Mongoose schema for a test case.
 */
const testCaseSchema = new Schema({
  input: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  expectedOutput: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  description: { 
    type: String 
  }
}, { 
  _id: false
});

/**
 * Mongoose schema for an exercise.
 */
const exerciseSchema = new Schema<IExercise>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    lowercase: true,
    trim: true,
    enum: {
      values: [
        'python',
        'javascript',
        'typescript',
        'java',
        'cpp',
        'c',
        'csharp',
        'go',
        'rust',
        'php',
        'ruby'
      ] as ProgrammingLanguage[],
      message: 'Unsupported language: {VALUE}'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    lowercase: true,
    enum: {
      values: ['easy', 'medium', 'hard'] as DifficultyLevel[],
      message: 'Invalid difficulty: {VALUE}. Must be easy, medium, or hard'
    }
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    lowercase: true,
    enum: {
      values: ['arrays', 'strings', 'loops', 'data-structures', 'algorithms', 'logic-math'] as ExerciseCategory[],
      message: 'Invalid category: {VALUE}'
    }
  },
  keywords: {
    type: [String],
    default: []
  },
  testCases: [testCaseSchema],
  solution: {
    type: String,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});

/**
 * Indexes for efficient search
 */
// Compound index for common filtering
exerciseSchema.index({ 
  difficulty: 1, 
  language: 1 
});

// Text index for keyword searches.
// language_override avoids a conflict with the exercise's 'language' field.
exerciseSchema.index({
  title: 'text',
  description: 'text',
  keywords: 'text'
}, { language_override: 'textLang' });

// Index for tags
exerciseSchema.index({ 
  tags: 1 

});

// Index for category
exerciseSchema.index({ 
  category: 1 
});

// Index for sorting by date
exerciseSchema.index({ 
  createdAt: -1 
});

/**
 * Pre-save middleware.
 */
exerciseSchema.pre('save', function(next) {
  // Normalize tags.
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => tag.toLowerCase().trim());
    this.tags = [...new Set(this.tags)];
  }
  
  // Normalize keywords.
  if (this.keywords && this.keywords.length > 0) {
    this.keywords = this.keywords.map(keyword => keyword.toLowerCase().trim());
    this.keywords = [...new Set(this.keywords)];
  }
  
  next();
});

/**
 * Method toJSON
 */
exerciseSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj._id = obj._id.toString();
  if (obj.userId) {
    obj.userId = obj.userId.toString();
  }
  return obj;
};

/**
 * Static method for searching with filters
 */
exerciseSchema.statics.findWithFilters = async function(filters: {
  difficulty?: DifficultyLevel;
  language?: ProgrammingLanguage;
  category?: ExerciseCategory;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query: any = {};

  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (filters.language) {
    query.language = filters.language;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.search) {
    // Search in title, description, and keywords
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { keywords: { $in: [new RegExp(filters.search, 'i')] } }
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const [exercises, total] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    exercises,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Exercise model
 */

// Singleton to avoid recompilation in tsx
let cachedModel: Model<IExercise> | null = null;

export const getExerciseModel = (): Model<IExercise> => {
  if (cachedModel) return cachedModel;
  
  if (mongoose.models.Exercise) {
    cachedModel = mongoose.models.Exercise as Model<IExercise>;
    return cachedModel;
  }
  
  cachedModel = mongoose.model<IExercise>('Exercise', exerciseSchema);
  return cachedModel;
};

// Default and named exports for compatibility.
export const Exercise = getExerciseModel();
export default Exercise;