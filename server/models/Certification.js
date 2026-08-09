import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../constants/index.js';

const certificationSchema = new mongoose.Schema(
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
    issuingOrganization: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      }
    ],
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
certificationSchema.index({ studentId: 1, isDeleted: 1 });
certificationSchema.index({ tenantId: 1, isDeleted: 1 });

// Prevent duplicate certifications for the same student (case-insensitive)
certificationSchema.index(
  { studentId: 1, name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false }, collation: { locale: 'en', strength: 2 } }
);

const Certification = mongoose.model(COLLECTION_NAMES.CERTIFICATION, certificationSchema);
export default Certification;
