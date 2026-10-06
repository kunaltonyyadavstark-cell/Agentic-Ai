/**
 * Types for the AI service (Gemini)
 */

/**
 * Request to generate a solution
 */
export interface GenerateSolutionRequest {
  problem: string;
  language: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  hints?: string[];
}

/**
 * Generated solution response
 */
export interface GenerateSolutionResponse {
  solution: string;
  explanation: string;
  language: string;
  complexity?: string;
  alternativeApproaches?: string[];
}

/**
 * Request to analyze code
 */
export interface AnalyzeCodeRequest {
  code: string;
  language: string;
  focusAreas?: ('performance' | 'readability' | 'bugs' | 'security')[];
}

/**
 * Code analysis response
 */
export interface AnalyzeCodeResponse {
  issues: CodeIssue[];
  suggestions: string[];
  complexity: string;
  rating: number; // 1-10
  summary: string;
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'suggestion';
  line?: number;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Explanation request
 */
export interface ExplainRequest {
  topic: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  includeExamples?: boolean;
}

/**
 * Explanation response
 */
export interface ExplainResponse {
  explanation: string;
  examples?: string[];
  relatedTopics?: string[];
  resources?: string[];
}