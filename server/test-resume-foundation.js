import mongoose from 'mongoose';
import { z } from 'zod';
import { RESUME_UPLOAD_STATUS, RESUME_PARSING_STATUS, RESUME_FILE_TYPES } from './constants/resume.constants.js';
import Resume from './models/Resume.js';
import { uploadResumeMetadataSchema } from './validators/resume.validator.js';

async function runTests() {
  console.log('--- Starting Resume Foundation Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Verify Constants
    assert(RESUME_UPLOAD_STATUS.PENDING === 'PENDING', 'RESUME_UPLOAD_STATUS exists');
    assert(RESUME_PARSING_STATUS.COMPLETED === 'COMPLETED', 'RESUME_PARSING_STATUS exists');
    assert(RESUME_FILE_TYPES.includes('application/pdf'), 'RESUME_FILE_TYPES includes pdf');

    // 2. Verify Schema compilation
    const mockId = new mongoose.Types.ObjectId();
    const resumeDoc = new Resume({
      studentId: mockId,
      userId: mockId,
      tenantId: mockId,
      originalFileName: 'resume.pdf',
      fileUrl: 'https://s3.bucket/resume.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 1024,
      isPrimary: true
    });

    const validationError = resumeDoc.validateSync();
    assert(!validationError, 'Mongoose Schema valid with required fields');

    // 3. Verify Zod Schema
    const validMetadata = {
      body: {
        originalFileName: 'john_doe_resume.pdf',
        fileType: 'application/pdf',
        fileSize: 2 * 1024 * 1024, // 2MB
        isPrimary: true,
        base64File: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPU0FDQvJ...' // dummy base64 string
      }
    };
    const zodResult = uploadResumeMetadataSchema.safeParse(validMetadata);
    assert(zodResult.success, 'Zod validation passes for valid metadata');

    const invalidMetadata = {
      body: {
        originalFileName: '',
        fileType: 'image/png', // Invalid type
        fileSize: 20 * 1024 * 1024, // > 10MB
      }
    };
    const invalidZodResult = uploadResumeMetadataSchema.safeParse(invalidMetadata);
    assert(!invalidZodResult.success, 'Zod validation fails for invalid metadata');

    const errors = invalidZodResult.error?.issues || [];
    assert(errors.some(e => e.path.includes('fileType')), 'Zod captures invalid fileType');
    assert(errors.some(e => e.path.includes('fileSize')), 'Zod captures invalid fileSize limit');
    assert(errors.some(e => e.path.includes('originalFileName')), 'Zod captures empty file name');

  } catch (error) {
    console.error('Test execution failed:', error);
  }

  console.log(`\n--- Test Results: ${passed} Passed, ${failed} Failed ---`);
  if (failed > 0) process.exit(1);
  process.exit(0);
}

runTests();
