# 📡 API Documentation

Complete documentation for the AgentLogic REST API.

## Base URL
http://localhost:5000/api

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Required headers
```http
Authorization: Bearer <token>
Content-Type: application/json

🔐 Authentication Endpoints
`POST /api/auth/register`
Register a new user.
Request:
json{
  "email": "user@example.com",
  "password": "Password123",
  "username": "johndoe",
  "name": "User Test"
}
Response (201):
json{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "User Test",
      "createdAt": "2025-10-07T06:00:00.000Z"
    }
  }
}

**Common Errors:**
- `400 Bad Request`: Validation failed (e.g., invalid email or weak password).
- `400 Bad Request`: The email is already registered.
- `429 Too Many Requests`: Registration limit reached (3 per hour).


`POST /api/auth/login`
Log in.
Request:
json{
  "email": "user@example.com",
  "password": "Password123"
}
Response (200):
json{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "User Test"
    }
  }
}

**Common Errors:**
- `401 Unauthorized`: Invalid credentials.
- `429 Too Many Requests`: Login attempt limit reached (5 per 15 minutes).


`GET /api/auth/me`
Get information about the authenticated user.
Headers:
httpAuthorization: Bearer <token>
Response (200):
json{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "User Test",
    "createdAt": "2025-10-07T06:00:00.000Z"
  }
}

**Common Errors:**
- `401 Unauthorized`: No token was provided.
- `401 Unauthorized`: The token is invalid or has expired.


📝 Exercise Endpoints
`GET /api/exercises`
List all exercises.
Query Parameters:

language (optional): Filter by language
difficulty (optional): Filter by difficulty (easy, medium, hard)
page (optional): Page number (default: 1)
limit (optional): Results per page (default: 10)

Example:
bashGET /api/exercises?language=javascript&difficulty=easy&page=1&limit=10
Response (200):
json{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Sum of two numbers",
      "description": "Create a function that adds two numbers",
      "difficulty": "easy",
      "language": "javascript",
      "testCases": [
        {
          "input": [2, 3],
          "expectedOutput": 5
        }
      ],
      "tags": ["beginner", "math"],
      "createdAt": "2025-10-07T06:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}

`GET /api/exercises/:id`
Get a specific exercise.
Response (200):
json{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Sum of two numbers",
    "description": "Create a function that adds two numbers",
    "difficulty": "easy",
    "language": "javascript",
    "testCases": [
      {
        "input": [2, 3],
        "expectedOutput": 5
      }
    ],
    "tags": ["beginner", "math"],
    "createdAt": "2025-10-07T06:00:00.000Z"
  }
}

**Common Errors:**
- `404 Not Found`: The exercise with the specified ID does not exist.
- `400 Bad Request`: The provided ID is not a valid ObjectId.


`POST /api/exercises`
Create a new exercise (authentication required).
Headers:
httpAuthorization: Bearer <token>
Request:
json{
  "title": "Sum of two numbers",
  "description": "Create a function that adds two numbers",
  "difficulty": "easy",
  "language": "javascript",
  "testCases": [
    {
      "input": [2, 3],
      "expectedOutput": 5
    }
  ],
  "tags": ["beginner", "math"]
}
Response (201):
json{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Sum of two numbers",
    ...
  }
}

**Common Errors:**
- `401 Unauthorized`: Authentication is required.
- `400 Bad Request`: Exercise data failed validation.


`PATCH /api/exercises/:id`
Update an exercise (authentication required).
Headers:
httpAuthorization: Bearer <token>
Request:
json{
  "title": "New title",
  "difficulty": "medium"
}
Response (200):
json{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "New title",
    "difficulty": "medium",
    ...
  }
}

**Common Errors:**
- `401 Unauthorized`: Authentication is required.
- `404 Not Found`: The exercise with the specified ID does not exist.
- `400 Bad Request`: Update data failed validation.


`DELETE /api/exercises/:id`
Delete an exercise (authentication required).
Headers:
httpAuthorization: Bearer <token>
Response (200):
json{
  "success": true,
  "message": "Exercise deleted successfully"
}

**Common Errors:**
- `401 Unauthorized`: Authentication is required.
- `404 Not Found`: The exercise with the specified ID does not exist.


🏥 Health Endpoint
`GET /health`
Check the server status.
Response (200):
json{
  "success": true,
  "message": "API is running successfully",
  "timestamp": "2025-10-07T06:00:00.000Z"
}

⚠️ Error Codes
| Code | Meaning                     |
|--------|---------------------------------|
| `200`  | Success                           |
| `201`  | Created                          |
| `400`  | Bad Request - Validation error|
| `401`  | Unauthorized - Not authenticated   |
| `404`  | Not Found - Resource not found|
| `429`  | Too Many Requests - Rate limit  |
| `500`  | Internal Server Error           |

🛡️ Rate Limits
| Endpoint | Limit      | Window |
|----------|-------------|---------|
| General  | 100 req     | 15 min  |
| Login    | 5 req       | 15 min  |
| Registration | 3 req       | 1 hour  |

📝 cURL Examples
Registration
bashcurl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "username": "johndoe",
    "name": "User Test"
  }'
Login
bashcurl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
Create Exercise
bashcurl -X POST http://localhost:5000/api/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "title": "Sum of numbers",
    "description": "...",
    "difficulty": "easy",
    "language": "javascript",
    "testCases": [...]
  }'

🔗 Additional Resources

Authentication
Rate Limiting
Security