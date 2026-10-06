/**
 * Gemini AI service
 * 
 * Handles communication with the Google Gemini API.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../config/logger.config';
import {
  GenerateSolutionRequest,
  GenerateSolutionResponse,
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
  ExplainRequest,
  ExplainResponse,
} from '../types/ai.types';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  /**
   * Initialize the service (lazy initialization).
   */
  private initialize(): void {
    if (this.genAI) return; // Already initialized.

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      logger.error('❌ GEMINI_API_KEY is not configured');
      throw new Error('GEMINI_API_KEY is not configured in the environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    logger.info('✅ Gemini service initialized with gemini-2.5-flash');
  }

  /**
   * Generate a code solution.
   */
  async generateSolution(request: GenerateSolutionRequest): Promise<GenerateSolutionResponse> {
    this.initialize(); // ✅ Initialize here.

    const startTime = Date.now();

    logger.info('🤖 Generating solution with Gemini', {
      language: request.language,
      difficulty: request.difficulty,
      problemLength: request.problem.length,
    });

    try {
      const prompt = this.buildSolutionPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const duration = Date.now() - startTime;

      logger.info('✅ Solution generated successfully', {
        duration: `${duration}ms`,
        responseLength: response.length,
      });

      return this.parseSolutionResponse(response, request.language);
    } catch (error) {
      logger.error('❌ Error generating solution', {
        error: (error as Error).message,
        language: request.language,
      });
      throw error;
    }
  }

  /**
   * Analyze the user's code.
   */
  async analyzeCode(request: AnalyzeCodeRequest): Promise<AnalyzeCodeResponse> {
    this.initialize(); // ✅ Initialize here.

    const startTime = Date.now();

    logger.info('🔍 Analyzing code with Gemini', {
      language: request.language,
      codeLength: request.code.length,
      focusAreas: request.focusAreas,
    });

    try {
      const prompt = this.buildAnalysisPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const duration = Date.now() - startTime;

      logger.info('✅ Analysis completed', {
        duration: `${duration}ms`,
        language: request.language,
      });

      return this.parseAnalysisResponse(response);
    } catch (error) {
      logger.error('❌ Error analyzing code', {
        error: (error as Error).message,
        language: request.language,
      });
      throw error;
    }
  }

  /**
   * Explain a concept or code.
   */
  async explain(request: ExplainRequest): Promise<ExplainResponse> {
    this.initialize(); // ✅ Initialize here.

    const startTime = Date.now();

    logger.info('📚 Generating explanation with Gemini', {
      topic: request.topic,
      level: request.level,
    });

    try {
      const prompt = this.buildExplanationPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const duration = Date.now() - startTime;

      logger.info('✅ Explanation generated', {
        duration: `${duration}ms`,
        topicLength: request.topic.length,
      });

      return this.parseExplanationResponse(response);
    } catch (error) {
      logger.error('❌ Error generating explanation', {
        error: (error as Error).message,
        topic: request.topic,
      });
      throw error;
    }
  }
  /**
  * Generate generic content with Gemini.
  * Useful for non-specific use cases.
  */
  async generateContent(prompt: string): Promise<string> {
    this.initialize();

    const startTime = Date.now();

    logger.info('🤖 Generating content with Gemini', {
      promptLength: prompt.length,
    });

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const duration = Date.now() - startTime;

      logger.info('✅ Content generated successfully', {
        duration: `${duration}ms`,
        responseLength: response.length,
      });

      return response;
    } catch (error) {
      logger.error('❌ Error generating content', {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  private buildSolutionPrompt(request: GenerateSolutionRequest): string {
    let prompt = `You are an expert programming tutor. Generate a complete solution to the following problem:\n\n`;
    prompt += `Problem: ${request.problem}\n`;
    prompt += `Language: ${request.language}\n`;

    if (request.difficulty) {
      prompt += `Difficulty: ${request.difficulty}\n`;
    }

    if (request.hints && request.hints.length > 0) {
      prompt += `Hints: ${request.hints.join(', ')}\n`;
    }

    prompt += `\nPlease provide:\n`;
    prompt += `1. SOLUTION: Complete, working code\n`;
    prompt += `2. EXPLANATION: How the solution works, step by step\n`;
    prompt += `3. COMPLEXITY: Time and space complexity analysis\n`;
    prompt += `4. ALTERNATIVES: Other possible approaches (optional)\n\n`;
    prompt += `Format the response clearly using these sections.`;

    return prompt;
  }

  private buildAnalysisPrompt(request: AnalyzeCodeRequest): string {
    let prompt = `You are an expert code reviewer. Analyze the following code:\n\n`;
    prompt += `\`\`\`${request.language}\n${request.code}\n\`\`\`\n\n`;

    if (request.focusAreas && request.focusAreas.length > 0) {
      prompt += `Focus especially on: ${request.focusAreas.join(', ')}\n\n`;
    }

    prompt += `Provide:\n`;
    prompt += `1. ISSUES: Problems found (errors, warnings, suggestions)\n`;
    prompt += `2. SUGGESTIONS: Suggestions for improvement\n`;
    prompt += `3. COMPLEXITY: Complexity analysis\n`;
    prompt += `4. RATING: Code rating (1-10)\n`;
    prompt += `5. SUMMARY: Summary of the analysis\n\n`;
    prompt += `Be specific and constructive.`;

    return prompt;
  }

  private buildExplanationPrompt(request: ExplainRequest): string {
    let prompt = `You are a programming tutor. Explain the following topic:\n\n`;
    prompt += `Topic: ${request.topic}\n`;
    prompt += `Level: ${request.level || 'intermediate'}\n\n`;

    if (request.includeExamples) {
      prompt += `Include practical code examples.\n\n`;
    }

    prompt += `Provide:\n`;
    prompt += `1. EXPLANATION: Clear and concise\n`;
    prompt += `2. EXAMPLES: Example code (if applicable)\n`;
    prompt += `3. RELATED TOPICS: Related concepts\n`;
    prompt += `4. RESOURCES: Additional resources for further learning\n`;

    return prompt;
  }

  private parseSolutionResponse(
    response: string,
    language: string
  ): GenerateSolutionResponse {
    return {
      solution: this.extractSection(response, 'SOLUTION') || response,
      explanation: this.extractSection(response, 'EXPLANATION') || '',
      language,
      complexity: this.extractSection(response, 'COMPLEXITY'),
      alternativeApproaches: this.extractSection(response, 'ALTERNATIVES')?.split('\n'),
    };
  }

  private parseAnalysisResponse(response: string): AnalyzeCodeResponse {
    return {
      issues: [],
      suggestions: this.extractSection(response, 'SUGGESTIONS')?.split('\n') || [],
      complexity: this.extractSection(response, 'COMPLEXITY') || 'O(n)',
      rating: this.extractRating(response) || 7,
      summary: this.extractSection(response, 'SUMMARY') || response,
    };
  }

  private parseExplanationResponse(response: string): ExplainResponse {
    return {
      explanation: this.extractSection(response, 'EXPLANATION') || response,
      examples: this.extractSection(response, 'EXAMPLES')?.split('\n'),
      relatedTopics: this.extractSection(response, 'RELATED TOPICS')?.split('\n'),
      resources: this.extractSection(response, 'RESOURCES')?.split('\n'),
    };
  }

  private extractSection(text: string, sectionName: string): string | undefined {
    const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n[A-Z]+:|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : undefined;
  }

  private extractRating(text: string): number | undefined {
    const match = text.match(/rating:?\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : undefined;
  }
}

// Export the singleton instance.
export const geminiService = new GeminiService();