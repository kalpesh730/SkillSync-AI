import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generates an Access Token (short-lived)
 * @param {Object} payload - Data to encode (e.g., { id, role, tenantId })
 * @returns {string} Signed JWT
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES || '15m',
  });
};

/**
 * Generates a Refresh Token (long-lived)
 * @param {Object} payload - Data to encode (e.g., { id })
 * @returns {string} Signed JWT
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES || '7d',
  });
};

/**
 * Verifies an Access Token
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

/**
 * Verifies a Refresh Token
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
