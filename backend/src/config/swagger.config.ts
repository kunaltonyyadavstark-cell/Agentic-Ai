/**
 * Swagger/OpenAPI configuration
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgentLogic API',
      version: '1.0.0',
      description: `
        🤖 REST API for an AI-powered programming education platform
        
        ## Features
        - 🔐 JWT authentication
        - 📝 Programming exercise management
        - 🤖 Gemini 2.0 integration for code generation
        - 🛡️ Rate limiting and comprehensive security
        - 📊 Professional logging
        
        ## Authentication
        Most endpoints require JWT authentication.
        
        1. Register a user at \`POST /api/auth/register\`
        2. Get a token at \`POST /api/auth/login\`
        3. Use the token in the header: \`Authorization: Bearer <token>\`
      `,
      contact: {
        name: 'AgentLogic Team',
        url: 'https://github.com/Bitxogm/New-Logic-Agent',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api-production.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter the JWT obtained after logging in',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Descriptive error message',
            },
          },
        },
        Exercise: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              example: 'Sum of two numbers',
            },
            description: {
              type: 'string',
              example: 'Create a function that adds two numbers',
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              example: 'easy',
            },
            language: {
              type: 'string',
              example: 'javascript',
            },
            testCases: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  input: {
                    type: 'array',
                    example: [2, 3],
                  },
                  expectedOutput: {
                    example: 5,
                  },
                },
              },
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['beginner', 'math'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            role: {
              type: 'string',
              example: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: '🔐 Authentication and user management',
      },
      {
        name: 'Exercises',
        description: '📝 Programming exercise management',
      },
      {
        name: 'AI',
        description: '🤖 Code generation with Gemini 2.0',
      },
      {
        name: 'Health',
        description: '🏥 Server status',
      },
    ],
  },
  apis: [
    './src/routes/*.ts', // Routes with JSDoc annotations
    './src/index.ts', // Health check
  ],
};

export const swaggerSpec = swaggerJsdoc(options);