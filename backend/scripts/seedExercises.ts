// backend/scripts/seedExercises.ts

import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';

// ============================================
// IMPORT EXERCISES FROM SEPARATE FILES
// ============================================
import { originalExercises } from './exercises/original-exercises';
import { pythonWorkbookChapter1 } from './exercises/python-workbook-chapter1';

dotenv.config();

// Combine all exercises
const exercises = [
  ...originalExercises,           // 30 original exercises
  ...pythonWorkbookChapter1,      // 12 Python Workbook exercises (3 exercises × 4 languages)
];

console.log('\n📊 AGENTLOGIC ACADEMY - EXERCISE SEEDER');
console.log('=========================================');
console.log(`Total exercises to seed: ${exercises.length}`);
console.log(`  → Original exercises: ${originalExercises.length}`);
console.log(`  → Python Workbook Ch1: ${pythonWorkbookChapter1.length}`);
console.log('');

// Define the Exercise schema directly here to avoid import issues
const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  language: { type: String, required: true },
  tags: [{ type: String }],
  category: { 
    type: String, 
    enum: ['arrays', 'strings', 'loops', 'data-structures', 'algorithms', 'logic-math'], 
    required: true 
  },
  keywords: [{ type: String }],
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    description: String,
  }],
  solution: String,
  starterCode: String,
  hints: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

const Exercise = mongoose.models.Exercise || mongoose.model('Exercise', exerciseSchema);

async function seedExercises() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agentlogic';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('🗑️  Cleared existing exercises');

    // Insert seed data (cast as any to avoid TypeScript type conflicts)
    await Exercise.insertMany(exercises as any);
    console.log(`✅ Inserted ${exercises.length} exercises`);

    // Show summary by category
    const summary = exercises.reduce((acc: any, ex: any) => {
      acc[ex.category] = (acc[ex.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Exercises by category:');
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

    // Show summary by language
    const langSummary = exercises.reduce((acc: any, ex: any) => {
      acc[ex.language] = (acc[ex.language] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n🌐 Exercises by language:');
    Object.entries(langSummary).forEach(([lang, count]) => {
      console.log(`   ${lang}: ${count}`);
    });

    // Show summary by source
    const sourceSummary = exercises.reduce((acc: any, ex: any) => {
      const source = ex.tags.includes('python-workbook') ? 'Python Workbook' : 'Original';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📚 Exercises by source:');
    Object.entries(sourceSummary).forEach(([source, count]) => {
      console.log(`   ${source}: ${count}`);
    });

    console.log('\n🎉 Seed completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedExercises();