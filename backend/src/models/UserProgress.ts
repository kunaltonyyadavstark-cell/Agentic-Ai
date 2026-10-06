// backend/src/models/UserProgress.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  iwith: string;
  unlockedAt: Date;
  category: 'learning' | 'testing' | 'social' | 'streak' | 'mastery';
}

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  totalXP: number;
  level: number;
  completedExercises: string[];
  achievements: IAchievement[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  exerciseStats: {
    exerciseId: string;
    attempts: number;
    bestScore: number;
    completedAt?: Date;
    timeSpent: number;
    difficulty: 'easy' | 'medium' | 'hard';
    language: string;
    category: string;
    xpEarned: number;
  }[];
  badges: string[];
  // ⬇️ ADD THESE 3 ⬇️
  dailyGoal: number;
  weeklyGoal: number;
  activityHistory: Array<{
    date: Date;
    xpEarned: number;
    exercisesCompleted: number;
  }>;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  calculateLevel(): number;
  addXP(amount: number): number;
  updateStreak(): number;
  unlockAchievement(achievement: IAchievement): boolean;
}
const achievementSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  iwith: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['learning', 'testing', 'social', 'streak', 'mastery'],
    required: true
  },
});

const exerciseStatSchema = new Schema({
  exerciseId: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  completedAt: { type: Date },
  timeSpent: { type: Number, default: 0 },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  language: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  xpEarned: {
    type: Number,
    default: 0
  },
});

const userProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    completedExercises: [{
      type: String,
    }],
    achievements: [achievementSchema],
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    exerciseStats: [exerciseStatSchema],
    badges: [{
      type: String,
    }],
    dailyGoal: {
      type: Number,
      default: 50,
    },
    weeklyGoal: {
      type: Number,
      default: 300,
    },
    activityHistory: [{
      date: { type: Date, required: true },
      xpEarned: { type: Number, default: 0 },
      exercisesCompleted: { type: Number, default: 0 },
    }],
  },
  {
    timestamps: true,
  }
);

// Calculate level from XP
userProgressSchema.methods.calculateLevel = function () {
  // Level formula: level = floor(sqrt(totalXP / 100))
  const newLevel = Math.floor(Math.sqrt(this.totalXP / 100)) + 1;
  this.level = Math.max(1, newLevel);
  return this.level;
};

// Add XP
userProgressSchema.methods.addXP = function (amount: number) {
  this.totalXP += amount;
  this.calculateLevel();
  return this.totalXP;
};

// Update streak
userProgressSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = new Date(this.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, no change
    return this.currentStreak;
  } else if (daysDiff === 1) {
    // Consecutive day
    this.currentStreak += 1;
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
  } else {
    // Streak broken
    this.currentStreak = 1;
  }

  this.lastActiveDate = new Date();
  return this.currentStreak;
};

// Unlock achievement
userProgressSchema.methods.unlockAchievement = function (achievement: IAchievement) {
  const exists = this.achievements.find((a: IAchievement) => a.id === achievement.id);
  if (!exists) {
    this.achievements.push(achievement);
    return true;
  }
  return false;
};

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', userProgressSchema);