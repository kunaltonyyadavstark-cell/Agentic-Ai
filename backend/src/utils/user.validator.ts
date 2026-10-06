interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * User validator with security by default
 */
export class UserValidator {
  private static readonly DANGEROUS_PATTERNS = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i
  ];

  /**
   * Validate username
   * - Minimum 3 characters, maximum 30
   * - Letters, numbers, underscores, and hyphens only
   * - No dangerous characters
   * 
   * @param username - Username to validate
   * @returns Validation result
   */
  static validateUsername(username: string): ValidationResult {
    if (!username || username.trim().length === 0) {
      return { isValid: false, error: 'Username cannot be empty' };
    }

    const trimmed = username.trim();



    if (trimmed.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters' };
    }

    if (trimmed.length > 30) {
      return { isValid: false, error: 'Username cannot exceed 30 characters' };
    }

    // Validate dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return { isValid: false, error: 'Username contains disallowed characters' };
      }
    }

    // Alphanumeric characters, underscores, and hyphens only
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return { isValid: false, error: 'Username may only contain letters, numbers, hyphens, and underscores' };
    }

    return { isValid: true, sanitized: trimmed };
  }

  /**
   * Validate email
   * 
   * @param email - Email to validate
   * @returns Validation result
   */
  static validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email cannot be empty' };
    }

    const trimmed = email.trim().toLowerCase();

    // A basic but effective email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      return { isValid: false, error: 'Invalid email' };
    }

    if (trimmed.length > 255) {
      return { isValid: false, error: 'Email is too long' };
    }

    return { isValid: true, sanitized: trimmed };
  }

  /**
   * Validate the password according to the security policy:
   * - At least 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   * 
   * @param password - Password to validate
   * @returns Validation result
   */
  static validatePassword(password: string): ValidationResult {
    if (!password || password.length === 0) {
      return { isValid: false, error: 'Password cannot be empty' };
    }

    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }

    if (password.length > 128) {
      return { isValid: false, error: 'Password is too long (maximum 128 characters)' };
    }

    // Complexity requirements.
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one special character' };
    }

    return { isValid: true };
  }
}