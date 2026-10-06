/**
 * ============================================
 * USER TYPES
 * ============================================
 */

export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * ============================================
 * EXERCISE TYPES
 * ============================================
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ExerciseCategory =
  | 'arrays'
  | 'strings'
  | 'loops'
  | 'data-structures'
  | 'algorithms'
  | 'logic-math';
  
export interface TestCase {
  input: any[];
  expectedOutput: any;
  description?: string;
}

export interface Exercise {
  _id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  language: string;
  tags: string[];
  category: ExerciseCategory;
  keywords: string[];
  testCases: TestCase[];
  solution?: string;
  starterCode?: string; // 👈 NEW PROPERTY
  hints?: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseData {
  title: string;
  description: string;
  difficulty: Difficulty;
  language: string;
  tags?: string[];
  category: ExerciseCategory;
  keywords?: string[];
  testCases: TestCase[];
  solution?: string;
  starterCode?: string; // 👈 NEW PROPERTY
  hints?: string[];
}

export interface UpdateExerciseData {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  language?: string;
  tags?: string[];
  category: ExerciseCategory;
  keywords?: string[];
  testCases?: TestCase[];
  solution?: string;
  starterCode?: string; // 👈 NEW PROPERTY
  hints?: string[];
}

export interface ExerciseFilters {
  language?: string;
  difficulty?: Difficulty;
  category?: ExerciseCategory;
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * ============================================
 * AI / GEMINI TYPES
 * ============================================
 */

export interface GenerateSolutionRequest {
  problem: string;
  language: string;
  difficulty?: Difficulty;
  hints?: string[];
}

export interface GenerateSolutionResponse {
  solution: string;
  explanation: string;
  language: string;
  complexity: string;
  alternativeApproaches?: string[];
}

export type FocusArea = 'performance' | 'readability' | 'bugs' | 'security';

export interface AnalyzeCodeRequest {
  code: string;
  language: string;
  focusAreas?: FocusArea[];
}

export interface CodeIssue {
  line?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  suggestion?: string;
}

export interface AnalyzeCodeResponse {
  issues: CodeIssue[];
  suggestions: string[];
  complexity: string;
  rating: number; // 1-10
  summary: string;
  improvedCode?: string;
}

export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface ExplainConceptRequest {
  topic: string;
  level?: Level;
  includeExamples?: boolean;
}

export interface ExplainConceptResponse {
  explanation: string;
  examples?: string[];
  relatedTopics?: string[];
  resources?: string[];
}

/**
 * ============================================
 * SOLUTION TYPES (Historial)
 * ============================================
 */

export interface Solution {
  _id: string;
  exerciseId: string;
  userId: string;
  code: string;
  language: string;
  explanation?: string;
  complexity?: string;
  rating?: number;
  isCorrect?: boolean;
  createdAt: string;
}

export interface SaveSolutionData {
  exerciseId: string;
  code: string;
  language: string;
  explanation?: string;
  complexity?: string;
  rating?: number;
  isCorrect?: boolean;
}

/**
 * ============================================
 * CHAT TYPES (Para chatbot)
 * ============================================
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface ChatSession {
  _id: string;
  userId: string;
  exerciseId?: string;
  messages: ChatMessage[];
  context?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  sessionId?: string;
  message: string;
  exerciseId?: string;
  context?: Record<string, any>;
}

export interface SendMessageResponse {
  sessionId: string;
  message: ChatMessage;
  suggestions?: string[];
}

/**
 * ============================================
 * FLOWCHART TYPES
 * ============================================
 */

export type FlowchartNodeType =
  | 'start'
  | 'end'
  | 'process'
  | 'decision'
  | 'input'
  | 'output'
  | 'loop';

export interface FlowchartNode {
  id: string;
  type: FlowchartNodeType;
  label: string;
  x: number;
  y: number;
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

export interface GenerateFlowchartRequest {
  problem: string;
  language?: string;
}

export interface GenerateFlowchartResponse {
  flowchart: FlowchartData;
  description: string;
  steps: string[];
}

/**
 * ============================================
 * UTILITY TYPES
 * ============================================
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * ============================================
 * FORM TYPES
 * ============================================
 */

export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * ============================================
 * THEME TYPES
 * ============================================
 */

export type Theme = 'light' | 'dark' | 'system';

/**
 * ============================================
 * NOTIFICATION TYPES
 * ============================================
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}