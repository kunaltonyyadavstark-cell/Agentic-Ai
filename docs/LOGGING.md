### 2. `docs/LOGGING.md`
```markdown
# 🪵 Logging System

Complete guide to the Winston logging system.

## 📋 Contents

- [Introduction](#introduction)
- [Configuration](#configuration)
- [Log Levels](#log-levels)
- [Basic Usage](#basic-usage)
- [Sanitization](#sanitization)
- [Log Files](#log-files)
- [Examples](#examples)

---

## 🎯 Introduction

AgentLogic uses **Winston** as a professional logging system with:

- ✅ Multiple levels (error, warn, info, http, debug)
- ✅ Separate files for each level
- ✅ Automatic sanitization of sensitive data
- ✅ JSON format in production
- ✅ Colorized format in development
- ✅ Automatic log rotation

---

## ⚙️ Configuration

The logger is configured in `backend/src/config/logger.config.ts`.

### Levels by Environment

- **Development**: `debug` (shows all levels)
- **Production**: `info` (info, warn, and error only)

### Log Files
backend/logs/
├── error.log       # Errors only
└── combined.log    # All levels

---

## 📊 Log Levels

| Level | Use | Color | When to Use |
|-------|-----|-------|-------------|
| `error` | Critical errors | 🔴 Red | Errors that require attention |
| `warn` | Warnings | 🟡 Yellow | Abnormal but non-critical situations |
| `info` | General information | 🟢 Green | Important normal events |
| `http` | HTTP requests | 🟣 Magenta | Automatic (middleware) |
| `debug` | Debugging | 🔵 Blue | Development only |

---

## 💡 Basic Usage

### Import the logger
```typescript
import logger from '../config/logger.config';
import { sanitizeForLog } from '../config/logger.config';
### Logging Messages
typescript// General information
logger.info('User created successfully', {
  userId: user._id,
  email: user.email
});

// Warnings
logger.warn('Failed login attempt', {
  email: 'user@example.com',
  ip: req.ip
});

// Errors
logger.error('Error connecting to MongoDB', {
  error: error.message,
  stack: error.stack
});

// Debug (development only)
logger.debug('Configuration value', {
  config: process.env.NODE_ENV
});

🔒 Data Sanitization
Why Sanitize?
NEVER log:

❌ Passwords
❌ JWT tokens
❌ API keys
❌ Authorization headers
❌ Sensitive cookies

### Using sanitizeForLog
The function `sanitizeForLog` (exported from `logger.config.ts`) clones an object and redacts any field containing sensitive keywords.

```typescript
// ❌ BAD - Logs the password in plain text
logger.info('Received data', req.body);

// ✅ GOOD - Password is redacted
logger.info('Received data', sanitizeForLog(req.body));
```

**Example:**
```typescript
const data = {
  email: 'user@example.com',
  password: 'secret123',        // Will be redacted
  token: 'jwt.token.here',      // Will be redacted
  name: 'User'               // Untouched
};

const safe = sanitizeForLog(data);
// Result:
// {
//   email: 'user@example.com',
//   password: '***REDACTED***',
//   token: '***REDACTED***',
//   name: 'User'
// }
Automatically Sanitized Fields

password
token
refreshToken
authorization
cookie
Any field containing these words (case-insensitive)


📁 Log Files
Location
backend/logs/
├── error.log       # Errors only (level: error)
└── combined.log    # All logs
### Rotation

Maximum size: 5 MB per file
Files to retain: 5
Rotation: Automatic when the limit is reached

View Logs in Real Time
bash# View all logs
tail -f logs/combined.log

# View errors only
tail -f logs/error.log

# View the last 50 lines
tail -n 50 logs/combined.log

📝 Examples
1. Logging in Controllers
typescriptimport logger from '../config/logger.config';
import { sanitizeForLog } from '../config/logger.config';

class ExerciseController {
  async create(req: Request, res: Response) {
    const startTime = Date.now();
    
    logger.info('Creating exercise', {
      title: req.body.title,
      language: req.body.language
    });

    try {
      const exercise = await Exercise.create(req.body);
      const duration = Date.now() - startTime;

      logger.info('Exercise created successfully', {
        exerciseId: exercise._id,
        duration: `${duration}ms`
      });

      res.status(201).json({ success: true, data: exercise });
    } catch (error) {
      logger.error('Error creating exercise', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        body: sanitizeForLog(req.body)
      });
      throw error;
    }
  }
}
2. Logging in Authentication
typescriptclass AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const ip = req.ip;

    logger.info('Login attempt', { email, ip });

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      logger.warn('Login failed: user not found', { email, ip });
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      logger.warn('Login failed: incorrect password', {
        email,
        userId: user._id,
        ip
      });
      throw new AppError('Invalid credentials', 401);
    }

    logger.info('Login successful', {
      userId: user._id,
      email: user.email,
      ip
    });

    // ... generate token
  }
}
3. Rate Limit Logging
typescript// Automatic in rateLimiter.ts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    logger.error('🚨 ALERT: Rate limit reached - Login', {
      ip: req.ip,
      email: req.body?.email,
      attempts: 5
    });
    
    res.status(429).json({ ... });
  }
});

🔍 Search Logs
Useful Commands
bash# Search for errors
grep "error" logs/combined.log

# Search by email
grep "user@example.com" logs/combined.log

# Count errors
grep "error" logs/combined.log | wc -l

# View today's logs
grep "$(date +%Y-%m-%d)" logs/combined.log

# Search rate limits
grep "Rate limit" logs/combined.log
With jq (for JSON in production)
bash# View only 500 errors
cat logs/error.log | jq 'select(.status == 500)'

# View a user's logs
cat logs/combined.log | jq 'select(.userId == "123")'

# Count by error type
cat logs/error.log | jq '.error.message' | sort | uniq -c

🎯 Best Practices
✅ DO
typescript// Log useful information
logger.info('User created', { userId: user._id, email: user.email });

// Log errors with context
logger.error('Error during operation', {
  error: error.message,
  operation: 'createUser',
  data: sanitizeForLog(req.body)
});

// Use appropriate levels
logger.warn('Rate limit reached', { ip: req.ip });
❌ DON'T
typescript// Do not log passwords
logger.info('Login', { email, password }); // ❌

// Do not log tokens
logger.info('Auth', { token: jwt }); // ❌

// Do not use console.log in production
console.log('This will not appear in the logs'); // ❌

// Do not log unnecessary information
logger.debug(JSON.stringify(hugeObject)); // ❌

📊 Monitoring
View Statistics
bash# Requests by method
cat logs/combined.log | grep -oP '(GET|POST|PATCH|DELETE)' | sort | uniq -c

# Requests per day
cat logs/combined.log | grep -oP '\d{4}-\d{2}-\d{2}' | sort | uniq -c

# Most common errors
cat logs/error.log | grep -oP '"message":"[^"]*"' | sort | uniq -c | sort -rn

🔗 Resources

Winston Documentation
Log Levels Best Practices
API Documentation