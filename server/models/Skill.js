import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../constants/index.js';
import { SKILL_CATEGORIES, SKILL_PROFICIENCY } from '../constants/skill.constants.js';

const skillSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: SKILL_CATEGORIES,
    },
    proficiency: {
      type: String,
      required: true,
      enum: SKILL_PROFICIENCY,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    lastUsed: {
      type: Date,
      validate: {
        validator: function (v) {
          return !v || v <= new Date();
        },
        message: 'lastUsed cannot be a future date.',
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationSource: {
      type: String,
      trim: true,
    },
    certificationId: {
      type: String,
      trim: true,
    },
    aiScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    displayOrder: {
      type: Number,
      required: true,
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
skillSchema.index({ studentId: 1, isDeleted: 1 });
skillSchema.index({ tenantId: 1, isDeleted: 1 });

// Prevent duplicate skills for the same student
// Case-insensitive uniqueness can be enforced with collation, but Mongoose unique compound index with collation is supported in newer versions.
skillSchema.index(
  { studentId: 1, name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false }, collation: { locale: 'en', strength: 2 } }
);

const Skill = mongoose.model(COLLECTION_NAMES.SKILL, skillSchema);
export default Skill;
