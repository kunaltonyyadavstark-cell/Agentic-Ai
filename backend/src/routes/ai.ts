import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validateRequest';
import rateLimit from 'express-rate-limit';
import logger from '../config/logger.config';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    error: 'Too many AI requests. Please try again later.',
  },
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit reached - AI', {
      ip: req.ip,
      path: req.path,
      userId: (req as any).user?._id,
    });

    res.status(429).json({
      success: false,
      error: 'Too many AI requests. Please try again later.',
    });
  },
});

const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes.
  max: 50, // More permissive for real-time analysis.
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    error: 'Too many analysis requests. Please wait a moment.',
  },
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit reached - Code Analysis', {
      ip: req.ip,
      path: req.path,
      userId: (req as any).user?._id,
    });

    res.status(429).json({
      success: false,
      error: 'Too many analysis requests. Please wait a moment.',
    });
  },
});

/**
 * @swagger
 * /api/ai/generate-solution:
 *   post:
 *     summary: Generate a code solution with AI
 *     description: Use Gemini 2.0 to generate a complete code solution with an explanation and complexity analysis
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problem
 *               - language
 *             properties:
 *               problem:
 *                 type: string
 *                 description: Description of the problem to solve
 *                 example: Create a function that adds two integers
 *               language:
 *                 type: string
 *                 description: Programming language
 *                 example: javascript
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: Problem difficulty
 *                 example: easy
 *               hints:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional hints for the solution
 *                 example: ["Use the + operator", "Return the result"]
 *     responses:
 *       200:
 *         description: Solution generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     solution:
 *                       type: string
 *                       example: "function sum(a, b) { return a + b; }"
 *                     explanation:
 *                       type: string
 *                       example: This function takes two parameters and returns their sum...
 *                     language:
 *                       type: string
 *                       example: javascript
 *                     complexity:
 *                       type: string
 *                       example: "O(1) - constant time"
 *                     alternativeApproaches:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Invalid data (empty problem or language)
 *       401:
 *         description: Not authenticated
 *       429:
 *         description: Request limit exceeded (10 per 15 minutes)
 */
router.post(
  '/generate-solution',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.generateSolution.bind(aiController)
);

/**
 * @swagger
 * /api/ai/analyze-code:
 *   post:
 *     summary: Analyze user code
 *     description: Analyze code with AI to find issues, improvement suggestions, and a rating
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - language
 *             properties:
 *               code:
 *                 type: string
 *                 description: Code to analyze (maximum 10,000 characters)
 *                 example: "function sum(a, b) { return a + b; }"
 *               language:
 *                 type: string
 *                 description: Code language
 *                 example: javascript
 *               focusAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [performance, readability, bugs, security]
 *                 description: Specific areas to focus on
 *                 example: ["performance", "readability"]
 *     responses:
 *       200:
 *         description: Analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     issues:
 *                       type: array
 *                       items:
 *                         type: object
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     complexity:
 *                       type: string
 *                       example: "O(n)"
 *                     rating:
 *                       type: number
 *                       minimum: 1
 *                       maximum: 10
 *                       example: 8
 *                     summary:
 *                       type: string
 *       400:
 *         description: Code is empty, too long, or the language is invalid
 *       401:
 *         description: Not authenticated
 *       429:
 *         description: Request limit exceeded
 */
router.post(
  '/analyze-code',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.analyzeCode.bind(aiController)
);

/**
 * @swagger
 * /api/ai/explain:
 *   post:
 *     summary: Explain a programming concept
 *     description: Get a detailed explanation of a concept with examples and resources
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *             properties:
 *               topic:
 *                 type: string
 *                 description: Topic or concept to explain
 *                 example: "What is a variable in JavaScript?"
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 description: Explanation complexity level
 *                 example: beginner
 *               includeExamples:
 *                 type: boolean
 *                 description: Include code examples
 *                 example: true
 *     responses:
 *       200:
 *         description: Explanation generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     explanation:
 *                       type: string
 *                       example: A variable is a container for storing values...
 *                     examples:
 *                       type: array
 *                       items:
 *                         type: string
 *                     relatedTopics:
 *                       type: array
 *                       items:
 *                         type: string
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Topic is empty
 *       401:
 *         description: Not authenticated
 *       429:
 *         description: Request limit exceeded
 */
router.post(
  '/explain',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.explain.bind(aiController)
);

router.post(
  '/analyze-exercise',
  authenticate,
  aiController.analyzeExercise.bind(aiController)
);


router.post(
  '/generate-flowchart',
  authenticate,
  aiController.generateFlowchart.bind(aiController));


router.post(
  '/chat',
  authenticate,
  aiController.sendChatMessage.bind(aiController));


// ⬇️ ADD THESE LINES HERE ⬇️
router.post(
  '/analyze-progress',
  authenticate,
  analysisLimiter,
  aiController.analyzeProgress.bind(aiController)
);


export default router;