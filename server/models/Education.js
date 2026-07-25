import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../constants/index.js';

const educationSchema = new mongoose.Schema(
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
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    university: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },
    educationLevel: {
      type: String,
      required: true,
      enum: ['High School', 'Higher Secondary', 'Diploma', 'Bachelors', 'Masters', 'Doctorate', 'Other'],
    },
    semester: {
      type: Number,
      min: 1,
      max: 10,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    passingYear: {
      type: Number,
    },
    startYear: {
      type: Number,
    },
    endYear: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pursuing', 'Completed', 'Dropped'],
      default: 'Completed',
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
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
educationSchema.index({ studentId: 1, isDeleted: 1 });
educationSchema.index({ tenantId: 1, isDeleted: 1 });

// Prevent duplicate degrees from the same institution for the same student
educationSchema.index(
  { studentId: 1, institutionName: 1, degree: 1 }, 
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

const Education = mongoose.model('Education', educationSchema);
export default Education;
