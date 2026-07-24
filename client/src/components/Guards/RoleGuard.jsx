import React from 'react';
import { useAuthStore } from '../../store/authStore';

/**
 * RoleGuard Component
 * Renders its children ONLY if the authenticated user has one of the allowed roles.
 * Optionally provides a fallback UI if unauthorized.
 * 
 * @param {Array} allowedRoles - Array of role strings (e.g., ['STUDENT', 'PLACEMENT_OFFICER'])
 * @param {ReactNode} children - The protected UI
 * @param {ReactNode} fallback - UI to show if unauthorized (default: null)
 */
const RoleGuard = ({ allowedRoles = [], children, fallback = null }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user || !user.role) {
    return fallback;
  }

  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return fallback;
};

export default RoleGuard;
