import { MODULES, getProductModule } from './roles.js';

/**
 * Helper to determine the dashboard route based on user role module.
 *
 * @param {String} role
 * @returns {String} The route path to redirect to
 */
export const getDashboardRouteByRole = (role) => {
  const module = getProductModule(role);
  switch (module) {
    case MODULES.ADMIN:
      return '/admin/dashboard';
    case MODULES.COMPANY:
      return '/company/dashboard';
    case MODULES.STUDENT:
    default:
      return '/student/dashboard';
  }
};
