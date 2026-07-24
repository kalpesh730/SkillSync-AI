import React from 'react';
import RoleGuard from './RoleGuard';

/**
 * PermissionGuard Component
 * Currently wraps RoleGuard exactly as an alias.
 * Will be expanded in future phases to support a granular permission-string engine.
 * 
 * @param {Array} requiredPermissions - Currently acts as roles (e.g., ['STUDENT'])
 * @param {ReactNode} children - The protected UI
 * @param {ReactNode} fallback - UI to show if unauthorized (default: null)
 */
const PermissionGuard = ({ requiredPermissions = [], children, fallback = null }) => {
  return (
    <RoleGuard allowedRoles={requiredPermissions} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

export default PermissionGuard;
