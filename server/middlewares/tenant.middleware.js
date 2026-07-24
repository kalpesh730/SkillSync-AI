/**
 * tenant middleware
 * Ensures the authenticated user only accesses data belonging to their tenant.
 * Uses a generic approach where the target tenantId can be extracted from params, query, or body.
 * 
 * @param {String} extractFrom - Where to find the target tenantId ('params', 'query', 'body')
 * @param {String} key - The key name for the tenantId (default: 'tenantId')
 */
export const requireTenantMatch = (extractFrom = 'params', key = 'tenantId') => {
  return (req, res, next) => {
    // Super Admins typically bypass tenant restrictions to manage all tenants
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const targetTenantId = req[extractFrom][key];
    const userTenantId = req.user.tenant?.toString(); // Assuming User model has a tenant ref

    if (!targetTenantId) {
      const error = new Error('Target tenant ID is missing from the request');
      error.statusCode = 400;
      return next(error);
    }

    if (!userTenantId || targetTenantId !== userTenantId) {
      const error = new Error('You do not have permission to access this tenant\'s resources');
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};
