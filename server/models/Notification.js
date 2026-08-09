import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    type: {
      type: String,
      enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
      default: 'INFO'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Notification', notificationSchema);
