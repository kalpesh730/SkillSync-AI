/**
 * authorize middleware
 * Ensures the authenticated user's role is included in the allowedRoles array.
 * Must be used AFTER the `protect` (auth.middleware.js) middleware.
 * 
 * @param  {...String} allowedRoles 
 * @returns Express Middleware
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user should be populated by the protect middleware
    if (!req.user || !req.user.role) {
      const error = new Error('Not authorized to access this route');
      error.statusCode = 401;
      return next(error);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error(`User role ${req.user.role} is not authorized to access this route`);
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};
