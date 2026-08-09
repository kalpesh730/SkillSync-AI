import { NotificationService } from '../services/notification/notification.service.js';
import { apiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const getNotifications = async (req, res, next) => {
  try {
    const { _id: userId, tenantId } = req.user;
    const { unread } = req.query;
    const unreadOnly = unread === 'true';
    
    const notifications = await NotificationService.getNotificationsForUser(userId, tenantId, unreadOnly);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: userId, tenantId } = req.user;
    
    const notification = await NotificationService.markAsRead(id, userId, tenantId);
    
    if (!notification) {
      return apiResponse(res, HTTP_STATUS.NOT_FOUND, 'Notification not found');
    }
    
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const { _id: userId, tenantId } = req.user;
    
    await NotificationService.markAllAsRead(userId, tenantId);
    return apiResponse(res, HTTP_STATUS.OK, MESSAGES.SUCCESS);
  } catch (error) {
    next(error);
  }
};
