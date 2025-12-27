/**
 * Authentication utilities for admin panel
 * Simple password-based authentication using cookies
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Verify admin password
 */
export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/**
 * Generate session token
 */
export function generateSessionToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
}

/**
 * Check if session is valid
 */
export function isSessionValid(expiresAt: number): boolean {
  return Date.now() < expiresAt;
}

/**
 * Get session expiry timestamp
 */
export function getSessionExpiry(): number {
  return Date.now() + SESSION_DURATION;
}

/**
 * Hash password (simple implementation for demonstration)
 * In production, use bcrypt or similar
 */
export function hashPassword(password: string): string {
  return Buffer.from(password).toString('base64');
}

/**
 * Compare password with hash
 */
export function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
