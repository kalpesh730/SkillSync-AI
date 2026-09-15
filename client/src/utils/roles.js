export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  COLLEGE_ADMIN: 'COLLEGE_ADMIN',
  PLACEMENT_OFFICER: 'PLACEMENT_OFFICER',
  STUDENT: 'STUDENT',
  COMPANY_HR: 'COMPANY_HR',
  RECRUITER: 'RECRUITER',
};

export const MODULES = {
  STUDENT: 'STUDENT',
  COMPANY: 'COMPANY',
  ADMIN: 'ADMIN',
};

/**
 * Maps legacy database roles to the 3 core product modules:
 * STUDENT -> STUDENT
 * RECRUITER / COMPANY_HR -> COMPANY
 * PLACEMENT_OFFICER / COLLEGE_ADMIN / SUPER_ADMIN -> ADMIN
 *
 * @param {String} role
 * @returns {String} Product Module Name ('STUDENT' | 'COMPANY' | 'ADMIN')
 */
export const getProductModule = (role) => {
  switch (role) {
    case ROLES.STUDENT:
      return MODULES.STUDENT;
    case ROLES.RECRUITER:
    case ROLES.COMPANY_HR:
      return MODULES.COMPANY;
    case ROLES.PLACEMENT_OFFICER:
    case ROLES.COLLEGE_ADMIN:
    case ROLES.SUPER_ADMIN:
      return MODULES.ADMIN;
    default:
      return MODULES.STUDENT;
  }
};
