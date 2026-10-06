/**
 * AI controller
 * 
 * Handles requests related to Gemini AI
 */

import { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger.config';
import {Exercise} from '../models/Exercise';
import {
  GenerateSolutionRequest,
  AnalyzeCodeRequest,
  ExplainRequest,
} from '../types/ai.types';


export class AIController {
  /**
   * Generate a code solution
   * POST /api/ai/generate-solution
   */
  async generateSolution(req: Request, res: Response): Promise<void> {
    const { problem, language, difficulty, hints } = req.body as GenerateSolutionRequest;

    // Validation
    if (!problem || !problem.trim()) {
      throw new AppError('Problem cannot be empty', 400);
    }

    if (!language || !language.trim()) {
      throw new AppError('Language is required', 400);
    }

    logger.info('Solution generation request', {
      language,
      difficulty,
      userId: (req as any).user?._id,
    });

    const result = await geminiService.generateSolution({
      problem,
      language,
      difficulty,
      hints,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  /**
   * Analyze user code
   * POST /api/ai/analyze-code
   */
  async analyzeCode(req: Request, res: Response): Promise<void> {
    const { code, language, focusAreas } = req.body as AnalyzeCodeRequest;

    // Validation
    if (!code || !code.trim()) {
      throw new AppError('Code cannot be empty', 400);
    }

    if (!language || !language.trim()) {
      throw new AppError('Language is required', 400);
    }

    // Code length limit
    if (code.length > 10000) {
      throw new AppError('Code is too long (maximum 10,000 characters)', 400);
    }

    logger.info('Code analysis request', {
      language,
      codeLength: code.length,
      focusAreas,
      userId: (req as any).user?._id,
    });

    const result = await geminiService.analyzeCode({
      code,
      language,
      focusAreas,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }
  /**
   * Generate a Mermaid flowchart for an exercise
   * POST /api/ai/generate-flowchart
   */
  async generateFlowchart(req: Request, res: Response): Promise<void> {
    const { exerciseId } = req.body;

    if (!exerciseId) {
      throw new AppError('exerciseId is required', 400);
    }

    // Get exercise from database
    const { Exercise } = await import('../models/Exercise');
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    logger.info('Generating flowchart', {
      exerciseId,
      title: exercise.title,
      userId: (req as any).user?._id,
    });

    // Create prompt for Gemini
   const prompt = `
You are an expert at creating educational flowcharts. Create a Mermaid flowchart for this programming exercise.

Exercise Title: ${exercise.title}
Description: ${exercise.description}
Language: ${exercise.language}

Create a flowchart that shows the ALGORITHM/LOGIC to solve this problem, NOT the specific code.

CRITICAL RULES for Mermaid syntax:
1. Use flowchart TD syntax
2. Node labels CANNOT contain: parentheses (), brackets [], braces {}, semicolons ;, colons :
3. Use simple, SHORT labels (max 4-5 words)
4. Decision nodes use {curly braces}
5. Process nodes use [square brackets]
6. Keep it educational (5-10 nodes maximum)

GOOD examples:
- A[Start]
- B{Check condition}
- C[Process data]
- D[Return result]

BAD examples (DO NOT USE):
- E[Is character a vowel (a,e,i,o,u)?]  ❌ Has parentheses
- F{Check if x > 0;}  ❌ Has semicolon
- G[Initialize: count = 0]  ❌ Has colon

Respond with JSON in this exact format:
{
  "mermaidCode": "flowchart TD\\n    A[Start] --> B{Check condition}\\n    B -->|Yes| C[Process]\\n    C --> D[End]\\n    B -->|No| D",
  "description": "This flowchart shows...",
  "steps": [
    "Start by initializing variables",
    "Check if condition is met",
    "Process the data",
    "Return the result"
  ]
}

Make sure:
- mermaidCode uses proper escaping for newlines (\\n)
- Node labels are SHORT and contain NO special characters
- Use --> for arrows
- Use |label| for arrow labels
`;
    // Call Gemini
    const geminiResponse = await geminiService.generateContent(prompt);
    
    // Parse JSON response
    let flowchartData;
    try {
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AppError('No JSON found in AI response', 500);
      }
      flowchartData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      logger.error('Failed to parse Gemini response:', parseError);
      throw new AppError('Failed to parse AI response', 500);
    }

    res.status(200).json({
      success: true,
      data: {
        exerciseId: exercise._id,
        exerciseTitle: exercise.title,
        flowchart: flowchartData,
      },
    });
  }

  /**
   * Send a message to the contextual chat.
   * POST /api/ai/chat
   */
  async sendChatMessage(req: Request, res: Response): Promise<void> {
    const { exerciseId, message, currentCode, conversationHistory } = req.body;

    if (!exerciseId || !message) {
      throw new AppError('exerciseId and message are required', 400);
    }

    // Get exercise from database
    const { Exercise } = await import('../models/Exercise');
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    logger.info('Processing chat message', {
      exerciseId,
      messageLength: message.length,
      hasCode: !!currentCode,
      userId: (req as any).user?._id,
    });

    // Build context-aware prompt
    const context = `
You are an expert programming tutor helping a student solve this exercise:

EXERCISE: ${exercise.title}
DESCRIPTION: ${exercise.description}
LANGUAGE: ${exercise.language}
DIFFICULTY: ${exercise.difficulty}

${currentCode ? `STUDENT'S CURRENT CODE:\n\`\`\`${exercise.language}\n${currentCode}\n\`\`\`` : 'Student hasn\'t written code yet.'}

CONVERSATION HISTORY:
${conversationHistory && conversationHistory.length > 0 
  ? conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')
  : 'This is the first message.'}

STUDENT'S QUESTION: ${message}

INSTRUCTIONS:
1. Be encouraging and educational
2. Don't give the complete solution
3. Guide them with hints and questions
4. Reference their current code if provided
5. Keep responses concise (2-3 paragraphs max)
6. If they're stuck, suggest breaking the problem into smaller steps
7. Celebrate their progress

Respond as a friendly tutor would:
`;

    // Call Gemini
    const geminiResponse = await geminiService.generateContent(context);

    // Return response
    res.status(200).json({
      success: true,
      data: {
        message: geminiResponse,
        timestamp: new Date().toISOString(),
        suggestedActions: this.generateSuggestedActions(exercise, currentCode),
      },
    });
  }

  /**
   * Generate suggested actions/questions for the chat
   */
  private generateSuggestedActions(_exercise: any, currentCode?: string): string[] {
    const actions = [];

    if (!currentCode) {
      actions.push("How do I start?");
      actions.push("Explain the problem");
    } else {
      actions.push("Is my approach correct?");
      actions.push("How can I improve this?");
      actions.push("Can you explain this concept?");
    }

    actions.push("Show me a hint");

    return actions;
  }

  /**
   * Explain a concept.
   * POST /api/ai/explain
   */
  async explain(req: Request, res: Response): Promise<void> {
    const { topic, level, includeExamples } = req.body as ExplainRequest;

    // Validation
    if (!topic || !topic.trim()) {
      throw new AppError('Topic cannot be empty', 400);
    }

    logger.info('Explanation request', {
      topic,
      level,
      includeExamples,
      userId: (req as any).user?._id,
    });

    const result = await geminiService.explain({
      topic,
      level,
      includeExamples,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }
  /**
   * Analyze an exercise and provide a learning roadmap.
   * POST /api/ai/analyze-exercise
   */
  async analyzeExercise(req: Request, res: Response): Promise<void> {
    const { exerciseId } = req.body;

    if (!exerciseId) {
      throw new AppError('exerciseId is required', 400);
    }

    // Get exercise from database
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    logger.info('Analyzing exercise', {
      exerciseId,
      title: exercise.title,
      userId: (req as any).user?._id,
    });

    // Create prompt for Gemini
    const prompt = `
You are an expert programming tutor. Analyze this programming exercise and provide a detailed learning plan.

Exercise Title: ${exercise.title}
Description: ${exercise.description}
Language: ${exercise.language}
Difficulty: ${exercise.difficulty}

Provide a JSON response with the following structure:
{
  "summary": "A brief 2-3 sentence summary of what this exercise teaches",
  "keyConcepts": ["concept1", "concept2", "concept3"],
  "estimatedTime": 15,
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "roadmap": [
    {
      "id": "1",
      "title": "Step title",
      "description": "What to do in this step",
      "completed": false
    }
  ],
  "difficulty": "beginner"
}

Make it encouraging and educational. The roadmap should guide them step-by-step without giving away the solution.
`;

    // Call Gemini
    const geminiResponse = await geminiService.generateContent(prompt);
    
    // Parse JSON response
    let analysisData;
    try {
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AppError('No JSON found in AI response', 500);
      }
      analysisData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      logger.error('Failed to parse Gemini response:', parseError);
      throw new AppError('Failed to parse AI response', 500);
    }

    res.status(200).json({
      success: true,
      data: {
        exerciseId: exercise._id,
        exerciseTitle: exercise.title,
        analysis: analysisData,
      },
    });
  }

  /**
   * Analyze code progress in real time.
   * POST /api/ai/analyze-progress
   */
  async analyzeProgress(req: Request, res: Response): Promise<void> {
    const { exerciseId, currentCode, language } = req.body;

    // Validation
    if (!exerciseId || !currentCode || !language) {
      throw new AppError('Missing required fields: exerciseId, currentCode, language', 400);
    }

    // Get exercise from database
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    logger.info(`Analyzing progress for exercise: ${exercise.title}`);

    // Prepare prompt for Gemini
    const prompt = `You are a programming tutor analyzing a student's code progress.

**Exercise:**
Title: ${exercise.title}
Description: ${exercise.description}
Language: ${language}
Difficulty: ${exercise.difficulty}

**Expected Solution:**
${exercise.solution}

**Student's Current Code:**
${currentCode}

**Your Task:**
Analyze the student's code and provide a detailed progress report in the following JSON format:

{
  "progressPercentage": <number 0-100>,
  "completedRequirements": [<array of strings describing what is correctly implemented>],
  "missingRequirements": [<array of strings describing what is still needed>],
  "suggestions": [<array of 2-3 actionable suggestions to improve the code>],
  "errors": [<array of syntax or logical errors found>],
  "isComplete": <boolean indicating if the solution is complete>
}

**Guidelines:**
- Be encouraging and constructive
- Focus on what works first, then what needs improvement
- Suggestions should be specific and actionable
- Don't give away the complete solution
- If code is empty or just started, progressPercentage should be 0-10
- If code has basic structure, 20-40
- If code is mostly working, 60-80
- If code is complete and correct, 90-100

Return ONLY the JSON object, no markdown formatting.`;

    // Call Gemini
    const geminiResponse = await geminiService.generateContent(prompt);

    // Parse response
    let analysis;
    try {
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AppError('No JSON found in AI response', 500);
      }
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      logger.error('Error parsing Gemini response:', parseError);
      
      // Fallback analysis
      analysis = {
        progressPercentage: currentCode.trim().length > 50 ? 30 : 10,
        completedRequirements: ['Code structure started'],
        missingRequirements: ['Complete implementation needed'],
        suggestions: ['Continue working on the solution', 'Test your code with the test cases'],
        errors: [],
        isComplete: false,
      };
    }

    // Ensure progressPercentage is within bounds
    analysis.progressPercentage = Math.max(0, Math.min(100, analysis.progressPercentage));

    logger.info(`Progress analysis complete: ${analysis.progressPercentage}%`);

    res.status(200).json({
      success: true,
      analysis,
    });
  }
}


// Export the instance.
export const aiController = new AIController();