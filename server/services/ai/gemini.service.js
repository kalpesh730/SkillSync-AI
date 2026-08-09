import crypto from 'crypto';
import { env } from '../../config/env.js';

// In-memory cache for MVP. Document future Redis integration.
const aiCache = new Map();

export class GeminiService {
  /**
   * Internal memory cache retrieval
   */
  static getFromCache(hash) {
    if (aiCache.has(hash)) {
      return aiCache.get(hash);
    }
    return null;
  }

  /**
   * Internal memory cache storage
   */
  static setToCache(hash, data) {
    aiCache.set(hash, data);
    // Future Redis integration: await redisClient.set(hash, JSON.stringify(data), 'EX', 86400)
  }

  /**
   * Generates a deterministic hash for identical inputs.
   */
  static generateHash(prompt, inputData) {
    const dataString = JSON.stringify(inputData);
    return crypto.createHash('sha256').update(prompt + dataString).digest('hex');
  }

  /**
   * Calls the Gemini API with a prompt and structured JSON response requested.
   * Handles caching, errors, and JSON parsing.
   * 
   * @param {string} prompt The AI instructions.
   * @param {Object} inputData The contextual data for the AI.
   * @returns {Promise<Object|null>}
   */
  static async generateStructuredContent(prompt, inputData) {
    if (!env.GEMINI_API_KEY) {
      console.warn('GeminiService: GEMINI_API_KEY is not configured. Returning null.');
      return null;
    }

    const hash = this.generateHash(prompt, inputData);
    const cached = this.getFromCache(hash);
    
    if (cached) {
      return cached;
    }

    try {
      const model = env.GEMINI_MODEL;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
      
      const fullPrompt = `
${prompt}

CONTEXT DATA:
${JSON.stringify(inputData, null, 2)}
      `;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        }),
        signal: AbortSignal.timeout(15000) // 15s timeout
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.error('GeminiService: Rate limit exceeded (429).');
        } else {
          const errorText = await response.text();
          console.error('GeminiService: API Error:', errorText);
        }
        return null;
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        console.error('GeminiService: No text returned from Gemini');
        return null;
      }

      const parsedData = JSON.parse(textResponse);
      this.setToCache(hash, parsedData);
      
      return parsedData;
    } catch (error) {
      console.error('GeminiService: Exception during generation:', error.message);
      return null;
    }
  }
}
