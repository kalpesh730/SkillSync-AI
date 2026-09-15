import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { getProductModule } from '../../utils/roles';

/**
 * RoleGuard Component
 * Renders its children ONLY if the authenticated user has one of the allowed roles or product modules.
 * Optionally provides a fallback UI if unauthorized.
 * 
 * @param {Array} allowedRoles - Array of role strings or product modules (e.g., ['STUDENT', 'COMPANY', 'ADMIN'])
 * @param {ReactNode} children - The protected UI
 * @param {ReactNode} fallback - UI to show if unauthorized (default: null)
 */
const RoleGuard = ({ allowedRoles = [], children, fallback = null }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user || !user.role) {
    return fallback;
  }

  const userModule = getProductModule(user.role);

  if (allowedRoles.includes(user.role) || allowedRoles.includes(userModule)) {
    return <>{children}</>;
  }

  return fallback;
};

export default RoleGuard;
