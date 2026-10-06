import api, { ApiResponse, getResponseData } from './api';
import {
  GenerateSolutionRequest,
  GenerateSolutionResponse,
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
  ExplainConceptRequest,
  ExplainConceptResponse,
} from '../types';

/**
 * AI Service (Gemini)
 * Handles all requests related to artificial intelligence
 */
class AIService {
  /**
   * Generate code solution with AI
   * Rate limit: 10 requests every 15 minutes
   */
  async generateSolution(
    data: GenerateSolutionRequest
  ): Promise<GenerateSolutionResponse> {
    const response = await api.post<ApiResponse<GenerateSolutionResponse>>(
      '/ai/generate-solution',
      data
    );
    return getResponseData(response);
  }

  /**
   * Analyze user code
   * Detects bugs, performance improvements, readability, etc.
   * Rate limit: 10 requests every 15 minutes
   */
  async analyzeCode(data: AnalyzeCodeRequest): Promise<AnalyzeCodeResponse> {
    const response = await api.post<ApiResponse<AnalyzeCodeResponse>>(
      '/ai/analyze-code',
      data
    );
    return getResponseData(response);
  }

  /**
   * Explain programming concept
   * Rate limit: 10 requests every 15 minutes
   */
  async explainConcept(
    data: ExplainConceptRequest
  ): Promise<ExplainConceptResponse> {
    const response = await api.post<ApiResponse<ExplainConceptResponse>>(
      '/ai/explain',
      data
    );
    return getResponseData(response);
  }

  /**
   * Generate solution for a specific exercise
   * Helper that combines exercise details with generation
   */
  async generateSolutionForExercise(
    exerciseTitle: string,
    exerciseDescription: string,
    language: string,
    difficulty?: 'easy' | 'medium' | 'hard',
    hints?: string[]
  ): Promise<GenerateSolutionResponse> {
    const problem = `${exerciseTitle}\n\n${exerciseDescription}`;

    return this.generateSolution({
      problem,
      language,
      difficulty,
      hints,
    });
  }

  /**
   * Analyze code with specific focus
   * Helper for quick analysis on predefined areas
   */
  async quickAnalyze(
    code: string,
    language: string,
    focus: 'bugs' | 'performance' | 'readability' | 'security' | 'all' = 'all'
  ): Promise<AnalyzeCodeResponse> {
    const focusAreas =
      focus === 'all'
        ? ['performance', 'readability', 'bugs', 'security']
        : [focus];

    return this.analyzeCode({
      code,
      language,
      focusAreas: focusAreas as any,
    });
  }

  /**
   * Get simple explanation (for beginners)
   */
  async getSimpleExplanation(topic: string): Promise<ExplainConceptResponse> {
    return this.explainConcept({
      topic,
      level: 'beginner',
      includeExamples: true,
    });
  }

  /**
   * Get advanced explanation
   */
  async getAdvancedExplanation(
    topic: string
  ): Promise<ExplainConceptResponse> {
    return this.explainConcept({
      topic,
      level: 'advanced',
      includeExamples: true,
    });
  }

  /**
   * Analyze exercise and get learning roadmap
   */
  async analyzeExercise(exerciseId: string) {
    const response = await api.post('/ai/analyze-exercise', { exerciseId });
    return getResponseData(response);
  }

  async generateFlowchart(exerciseId: string) {
    const response = await api.post('/ai/generate-flowchart', { exerciseId });
    return getResponseData(response);
  }

  /**
   * Send message to contextual chat
   */
  async sendChatMessage(
    exerciseId: string,
    message: string,
    currentCode: string,
    conversationHistory: Array<{ role: string; content: string }>
  ) {
    const response = await api.post('/ai/chat', {
      exerciseId,
      message,
      currentCode,
      conversationHistory,
    });
    return getResponseData(response);
  }

}

// Export singleton instance
export const aiService = new AIService();