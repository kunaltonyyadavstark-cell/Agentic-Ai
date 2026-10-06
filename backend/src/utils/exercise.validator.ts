/**
 * Validation result
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Exercise validator with built-in security
 */
export class ExerciseValidator {
  /**
   * Disallowed dangerous patterns.
   */
  private static readonly DANGEROUS_PATTERNS = [
    /<script/i,           // Script tags
    /javascript:/i,       // JavaScript URLs
    /on\w+\s*=/i,        // Event handlers (onclick, onerror, etc)
    /<iframe/i,          // iframes
    /<object/i,          // Objects
    /<embed/i            // Embeds
  ];

  /**
   * Validate an exercise title
   * 
   * @param title - Title to validate
   * @returns Validation result with sanitized value
   * 
   * @example
   * const result = ExerciseValidator.validateTitle('Sum of numbers');
   * if (result.isValid) {
   *   console.log(result.sanitized); // "Sum of numbers"
   * }
   */
  static validateTitle(title: string): ValidationResult {
    // Ensure that it is not empty
    if (!title || title.trim().length === 0) {
      return {
        isValid: false,
        error: 'Title cannot be empty'
      };
    }

    const trimmed = title.trim();

    // Validate minimum length
    if (trimmed.length < 3) {
      return {
        isValid: false,
        error: 'Title must be at least 3 characters'
      };
    }

    // Validate maximum length
    if (trimmed.length > 200) {
      return {
        isValid: false,
        error: 'Title cannot exceed 200 characters'
      };
    }

    // Validate dangerous patterns (security)
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isValid: false,
          error: 'Title contains disallowed characters'
        };
      }
    }

    // All good
    return {
      isValid: true,
      sanitized: trimmed
    };
  }

  /**
   * Validate exercise difficulty
   * 
   * @param difficulty - Difficulty to validate
   * @returns Validation result
   * 
   * @example
   * const result = ExerciseValidator.validateDifficulty('easy');
   * if (result.isValid) {
   *   console.log('Valid difficulty');
   * }
   */
  static validateDifficulty(difficulty: string): ValidationResult {
    const validDifficulties = ['easy', 'medium', 'hard'];
    const normalized = difficulty.toLowerCase().trim();

    if (!validDifficulties.includes(normalized)) {
      return {
        isValid: false,
        error: 'Difficulty must be easy, medium, or hard'
      };
    }

    return {
      isValid: true,
      sanitized: normalized
    };
  }

  /**
   * Validate an exercise description
   * 
   * @param description - Description to validate
   * @returns Validation result
   */
  static validateDescription(description: string): ValidationResult {
    if (!description || description.trim().length === 0) {
      return {
        isValid: false,
        error: 'Description cannot be empty'
      };
    }

    const trimmed = description.trim();

    if (trimmed.length < 10) {
      return {
        isValid: false,
        error: 'Description must be at least 10 characters'
      };
    }

    if (trimmed.length > 5000) {
      return {
        isValid: false,
        error: 'Description cannot exceed 5000 characters'
      };
    }

    // Validate dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isValid: false,
          error: 'Description contains disallowed characters'
        };
      }
    }

    return {
      isValid: true,
      sanitized: trimmed
    };
  }

  /**
   * Validate the programming language
   * 
   * @param language - Language to validate
   * @returns Validation result
   */
  static validateLanguage(language: string): ValidationResult {
    const validLanguages = [
      'python',
      'javascript',
      'typescript',
      'java',
      'cpp',
      'c',
      'csharp',
      'go',
      'rust',
      'php',
      'ruby'
    ];

    const normalized = language.toLowerCase().trim();

    if (!validLanguages.includes(normalized)) {
      return {
        isValid: false,
        error: `Unsupported language. Supported languages: ${validLanguages.join(', ')}`
      };
    }

    return {
      isValid: true,
      sanitized: normalized
    };
  }
}