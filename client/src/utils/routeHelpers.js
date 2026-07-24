import { ROLES } from './roles';

/**
 * Helper to determine the dashboard route based on user role.
 * 
 * @param {String} role 
 * @returns {String} The route path to redirect to
 */
export const getDashboardRouteByRole = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return '/admin/dashboard';
    case ROLES.COLLEGE_ADMIN:
    case ROLES.PLACEMENT_OFFICER:
      return '/college/dashboard';
    case ROLES.COMPANY_HR:
    case ROLES.RECRUITER:
      return '/company/dashboard';
    case ROLES.STUDENT:
      return '/student/dashboard';
    default:
      return '/'; // Fallback
  }
};
