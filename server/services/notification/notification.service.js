import Notification from '../../models/Notification.js';

export class NotificationService {
  static async createNotification(data) {
    const notification = new Notification(data);
    return await notification.save();
  }

  static async getNotificationsForUser(userId, tenantId, unreadOnly = false) {
    const query = { userId, tenantId };
    if (unreadOnly) {
      query.isRead = false;
    }
    
    return await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
  }

  static async markAsRead(notificationId, userId, tenantId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId, tenantId },
      { $set: { isRead: true } },
      { new: true }
    ).lean();
  }

  static async markAllAsRead(userId, tenantId) {
    return await Notification.updateMany(
      { userId, tenantId, isRead: false },
      { $set: { isRead: true } }
    );
  }
}
