import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../constants/index.js';
import { PROJECT_TYPES } from '../constants/project.constants.js';

const projectSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.STUDENT,
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COLLEGE,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      }
    ],
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      enum: PROJECT_TYPES,
      default: 'Personal',
    },
    teamSize: {
      type: Number,
      min: 1,
      default: 1,
    },
    role: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
    },
    // Future Ready Fields
    aiSummary: {
      type: String,
    },
    complexityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    recruiterVisible: {
      type: Boolean,
      default: true,
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
projectSchema.index({ studentId: 1, isDeleted: 1 });
projectSchema.index({ tenantId: 1, isDeleted: 1 });

// Prevent duplicate project titles for the same student (case-insensitive)
projectSchema.index(
  { studentId: 1, title: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false }, collation: { locale: 'en', strength: 2 } }
);

const Project = mongoose.model(COLLECTION_NAMES.PROJECT, projectSchema);
export default Project;
