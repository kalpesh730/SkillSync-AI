import mongoose from 'mongoose';
import { COLLECTION_NAMES } from '../constants/index.js';
import { COMPANY_SIZES, COMPANY_STATUS, COMPANY_VERIFICATION_STATUS } from '../constants/company.constants.js';

const companySchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.COLLEGE,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    legalName: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    companySize: {
      type: String,
      enum: COMPANY_SIZES,
      required: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    contactInfo: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: String,
    },
    verificationStatus: {
      type: String,
      enum: Object.values(COMPANY_VERIFICATION_STATUS),
      default: COMPANY_VERIFICATION_STATUS.PENDING,
    },
    status: {
      type: String,
      enum: Object.values(COMPANY_STATUS),
      default: COMPANY_STATUS.ACTIVE,
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
      required: true,
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
companySchema.index({ tenantId: 1, name: 1 });
companySchema.index({ tenantId: 1, industry: 1 });
companySchema.index({ tenantId: 1, isDeleted: 1 });

const Company = mongoose.model(COLLECTION_NAMES.COMPANY, companySchema);

export default Company;
