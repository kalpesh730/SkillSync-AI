import { env } from '../config/env.js';
import fs from 'fs/promises';
import { RESUME_CONSTANTS } from '../constants/resume.constants.js';

export class ResumeParserService {
  /**
   * Attempts to parse a resume using Gemini.
   * If the API key is missing or parsing fails, returns null.
   * 
   * @param {string} physicalPath The absolute path to the local file
   * @param {string} mimeType The MIME type of the file
   * @returns {Promise<Object|null>} Structured parsed data or null if failed/unavailable
   */
  static async parseResume(physicalPath, mimeType) {
    if (!env.GEMINI_API_KEY) {
      console.warn('ResumeParserService: GEMINI_API_KEY is not configured. Skipping AI parsing.');
      return null;
    }

    try {
      // We read the file back as base64 to send to Gemini as inlineData
      const fileBuffer = await fs.readFile(physicalPath);
      const base64Data = fileBuffer.toString('base64');

      // The prompt requests JSON output matching our desired schema
      const prompt = `
        You are an expert resume parser. Extract the following information from this resume document and return ONLY a valid JSON object. Do not wrap it in markdown code blocks.
        
        Schema to follow:
        {
          "name": "string",
          "email": "string",
          "phone": "string",
          "summary": "string",
          "skills": ["string"],
          "education": [{ "institution": "string", "degree": "string", "year": "string" }],
          "projects": [{ "title": "string", "description": "string" }],
          "certifications": [{ "name": "string", "issuer": "string" }],
          "experience": [{ "company": "string", "role": "string", "duration": "string", "description": "string" }],
          "achievements": ["string"],
          "links": ["string"]
        }
        
        If a field is not found in the resume, omit it or leave it empty, but return the JSON structure.
      `;

      // Call Gemini API via REST (Node.js 18+ native fetch)
      // We use the configurable GEMINI_MODEL which supports PDF inlineData (e.g. gemini-1.5-flash)
      const model = env.GEMINI_MODEL;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType || 'application/pdf',
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        return null;
      }

      const data = await response.json();
      
      // Extract the text response from Gemini
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        console.error('ResumeParserService: No text returned from Gemini');
        return null;
      }

      try {
        const parsedData = JSON.parse(textResponse);
        return parsedData;
      } catch (parseError) {
        console.error('ResumeParserService: Failed to parse Gemini output as JSON:', textResponse);
        return null;
      }

    } catch (error) {
      console.error('ResumeParserService: Exception during AI parsing:', error);
      return null;
    }
  }
}
