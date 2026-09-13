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
    if (req.user && req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const targetTenantId = req[extractFrom] && req[extractFrom][key];
    const userTenantId = req.user.tenantId?.toString(); // Fixed: req.user.tenantId

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

/**
 * Ensures the authenticated user has a valid tenant context (i.e. is not an unassigned/pending user)
 * before allowing access to tenant-scoped resources.
 */
export const requireTenantContext = (req, res, next) => {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // In a single-college architecture, we allow students to access their own resources
  // even if they do not have a tenantId assigned yet, relying on ownership checks.
  if (req.user && req.user.role === 'STUDENT') {
    return next();
  }

  // Enforce tenant context for other roles that strictly require it (like COLLEGE_ADMIN)
  if (req.user && ['COLLEGE_ADMIN', 'PLACEMENT_OFFICER'].includes(req.user.role) && !req.user.tenantId) {
    const error = new Error('You must be assigned to a college/tenant to access this resource.');
    error.statusCode = 403;
    return next(error);
  }

  next();
};
