/**
 * verifyOwnership helper
 * A reusable helper to verify if a user owns a specific resource.
 * Can be used inside controllers to validate logic.
 * 
 * @param {String} resourceOwnerId - The ID of the user who owns the resource
 * @param {Object} currentUser - The req.user object
 * @param {Boolean} allowSuperAdmin - Whether to allow SUPER_ADMIN to bypass
 * @returns {Boolean}
 */
export const verifyOwnership = (resourceOwnerId, currentUser, allowSuperAdmin = false) => {
  if (allowSuperAdmin && currentUser.role === 'SUPER_ADMIN') {
    return true;
  }
  
  if (!resourceOwnerId || !currentUser || !currentUser._id) {
    return false;
  }

  return resourceOwnerId.toString() === currentUser._id.toString();
};

/**
 * requireOwnership middleware
 * An express middleware wrapper for strict ownership checks where the resource ID is in req.params.
 * 
 * @param {String} paramKey - The req.params key containing the resource ID (default: 'id')
 */
export const requireOwnership = (paramKey = 'id') => {
  return (req, res, next) => {
    const resourceId = req.params[paramKey];
    
    if (verifyOwnership(resourceId, req.user)) {
      return next();
    }

    const error = new Error('You do not have permission to modify this resource');
    error.statusCode = 403;
    next(error);
  };
};
