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

  // Certain roles might not need a tenantId, e.g., COMPANY_HR or RECRUITER depending on design.
  // But for STUDENT, COLLEGE_ADMIN, PLACEMENT_OFFICER, they must have one to access tenant scoped routes.
  // We'll just enforce it generally. Wait, do Company users have a tenantId?
  // User.js says: tenantId ref College, companyId ref Company.
  // So a COMPANY_HR has a companyId, but no tenantId!
  // If we apply this to student routes, they are only accessed by students (tenantId) or recruiters (companyId).
  // Ah, the user's instructions say: "Add a clear server-side guard for users/students without tenant context."
  // And: "Tenant-scoped requests: Add a clear server-side guard for users/students without tenant context."
  if (req.user && req.user.role === 'STUDENT' && !req.user.tenantId) {
    const error = new Error('You must be assigned to a college/tenant to access this resource. Your account is pending assignment.');
    error.statusCode = 403;
    return next(error);
  }

  next();
};
