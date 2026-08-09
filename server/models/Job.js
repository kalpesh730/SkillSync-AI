import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../constants/index.js';
import { JOB_STATUS, EMPLOYMENT_TYPE, WORKPLACE_TYPE } from '../constants/job.constants.js';

const jobSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COLLEGE,
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COMPANY,
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPE,
      required: true,
    },
    workplaceType: {
      type: String,
      enum: WORKPLACE_TYPE,
      required: true,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    experienceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
    },
    requiredSkills: [{
      type: String,
      trim: true,
    }],
    preferredSkills: [{
      type: String,
      trim: true,
    }],
    educationRequirements: [{
      type: String,
      trim: true,
    }],
    openings: {
      type: Number,
      default: 1,
    },
    applicationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.DRAFT,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

// Indexes for searching/filtering
jobSchema.index({ tenantId: 1, status: 1 });
jobSchema.index({ companyId: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ tenantId: 1, isDeleted: 1 });

const Job = mongoose.model(COLLECTION_NAMES.JOB, jobSchema);

export default Job;
