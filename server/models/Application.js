import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../constants/index.js';
import { APPLICATION_STATUS } from '../constants/application.constants.js';

const applicationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COLLEGE,
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER, // Assuming student is a User
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.JOB,
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COMPANY,
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.RESUME,
      required: true,
    },
    coverLetter: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    screeningAt: {
      type: Date,
    },
    shortlistedAt: {
      type: Date,
    },
    interviewAt: {
      type: Date,
    },
    selectedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    withdrawnAt: {
      type: Date,
    },
    recruiterNotes: {
      type: String,
      trim: true,
      maxLength: 5000,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
applicationSchema.index({ tenantId: 1, isDeleted: 1 });
applicationSchema.index({ companyId: 1, status: 1 });
applicationSchema.index({ studentId: 1, status: 1 });

// Ensure a student can only have one active application per job.
// We only consider non-deleted applications. 
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
applicationSchema.index({ tenantId: 1, studentId: 1 });
applicationSchema.index({ tenantId: 1, jobId: 1 });
applicationSchema.index({ tenantId: 1, companyId: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
