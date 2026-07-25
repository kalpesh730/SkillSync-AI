import logger from '../utils/logger.js';

class AuditService {
  static async logEvent({ action, userId, targetId, resourceType, metadata = {} }) {
    try {
      logger.info(`Audit Log: [${action}] by User ${userId} on ${resourceType} ${targetId}`, {
        audit: true,
        action,
        userId,
        targetId,
        resourceType,
        metadata,
      });
      return true;
    } catch (error) {
      logger.error('Failed to write audit log', { error: error.message, action, userId });
      return false;
    }
  }
}

export default AuditService;
