export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  COLLEGE_ADMIN: 'College Admin',
  PLACEMENT_OFFICER: 'Placement Officer',
  STUDENT: 'Student',
  RECRUITER: 'Recruiter',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
};

export const LIMITS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const COLLECTION_NAMES = {
  USER: 'User',
  COLLEGE: 'College',
  STUDENT: 'Student',
  COMPANY: 'Company',
  JOB: 'Job',
  APPLICATION: 'Application',
  RESUME: 'Resume',
  AUDIT_LOG: 'AuditLog',
};

export const MESSAGES = {
  SUCCESS: 'Request processed successfully.',
  ERROR: 'An error occurred while processing the request.',
  UNAUTHORIZED: 'Unauthorized access.',
  FORBIDDEN: 'Forbidden access.',
  NOT_FOUND: 'Resource not found.',
};
