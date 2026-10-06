/**
 * Tests for Security Middleware
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { helmetConfig, mongoSanitize } from '../../middleware/security';
import { Request, Response, NextFunction } from 'express';

describe('Security Middleware', () => {
  describe('helmetConfig', () => {
    it('has a Helmet configuration', () => {
      expect(helmetConfig).toBeDefined();
      expect(typeof helmetConfig).toBe('function');
    });
  });

  describe('mongoSanitize', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
      mockRequest = {
        body: {},
        query: {},
        params: {},
        ip: '127.0.0.1',
        path: '/test',
      };
      mockResponse = {};
      nextFunction = vi.fn();
    });

    it('has the middleware', () => {
      expect(mongoSanitize).toBeDefined();
      expect(typeof mongoSanitize).toBe('function');
    });

    it('sanitizes $ in the body', () => {
      mockRequest.body = {
        email: 'test@test.com',
        $gt: 'malicious',
      };

      mongoSanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.$gt).toBeUndefined();
      expect(mockRequest.body.email).toBe('test@test.com');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('sanitizes . in keys', () => {
      mockRequest.body = {
        'user.name': 'test',
        email: 'test@test.com',
      };

      mongoSanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body['user.name']).toBeUndefined();
      expect(mockRequest.body.email).toBe('test@test.com');
    });

    it('sanitizes nested objects', () => {
      mockRequest.body = {
        user: {
          $where: 'malicious',
          name: 'test',
        },
      };

      mongoSanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.user.$where).toBeUndefined();
      expect(mockRequest.body.user.name).toBe('test');
    });
  });
});