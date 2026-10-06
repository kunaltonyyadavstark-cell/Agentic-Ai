import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { IUser, UserRole } from '../types';

// Create an interface extending Document with custom methods
interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Mongoose schema for User
 */
const userSchema = new Schema<IUserDocument>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username may only contain letters, numbers, hyphens, and underscores']
  },
    name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'] as UserRole[],
      message: 'Invalid role'
    },
    default: 'user'
  }
}, {
  timestamps: true,
  versionKey: false
});

/**
 * Remove duplicate indexes (unique: true already creates the indexes)
 */

/**
 * Pre-save middleware: Hash the password before saving
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Instance method: Compare the password
 * 
 * @param candidatePassword - Password to compare
 * @returns true if they match, false otherwise
 */
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

/**
 * toJSON method: Do not return the password
 */
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  obj._id = obj._id.toString();
  return obj;
};

/**
 * User model
 */
// Singleton to avoid recompilation in tests/hot reload
let cachedModel: Model<IUserDocument> | null = null;

export const getUserModel = (): Model<IUserDocument> => {
  if (cachedModel) return cachedModel;
  
  if (mongoose.models.User) {
    cachedModel = mongoose.models.User as Model<IUserDocument>;
    return cachedModel;
  }
  
  cachedModel = mongoose.model<IUserDocument>('User', userSchema);
  return cachedModel;
};

export const User = getUserModel();
export default User;