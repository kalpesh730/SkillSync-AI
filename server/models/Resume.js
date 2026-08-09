import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../constants/index.js';
import { RESUME_UPLOAD_STATUS, RESUME_PARSING_STATUS, RESUME_FILE_TYPES } from '../constants/resume.constants.js';

const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.STUDENT,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COLLEGE,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: RESUME_FILE_TYPES,
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    uploadStatus: {
      type: String,
      enum: Object.values(RESUME_UPLOAD_STATUS),
      default: RESUME_UPLOAD_STATUS.PENDING,
    },
    parsingStatus: {
      type: String,
      enum: Object.values(RESUME_PARSING_STATUS),
      default: RESUME_PARSING_STATUS.NOT_STARTED,
    },
    parsedAt: {
      type: Date,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 1,
    },
    // Future AI parsed data placeholder
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
    },
    // Soft Delete
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ studentId: 1, isDeleted: 1 });
resumeSchema.index({ tenantId: 1, isDeleted: 1 });

// Ensure only one primary resume per student
resumeSchema.index(
  { studentId: 1, isPrimary: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false, isPrimary: true } }
);

const Resume = mongoose.model(COLLECTION_NAMES.RESUME, resumeSchema);
export default Resume;
