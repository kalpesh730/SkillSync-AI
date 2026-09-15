import { getProductModule, MODULES, ROLES } from '../client/src/utils/roles.js';
import { getDashboardRouteByRole } from '../client/src/utils/routeHelpers.js';

function runTests() {
  console.log('=== Running Task 3 Role Consolidation Mapping Tests ===\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // 1. Verify legacy roles map to product modules
  assert(getProductModule(ROLES.STUDENT) === MODULES.STUDENT, 'STUDENT maps to STUDENT module');
  assert(getProductModule(ROLES.RECRUITER) === MODULES.COMPANY, 'RECRUITER maps to COMPANY module');
  assert(getProductModule(ROLES.COMPANY_HR) === MODULES.COMPANY, 'COMPANY_HR maps to COMPANY module');
  assert(getProductModule(ROLES.PLACEMENT_OFFICER) === MODULES.ADMIN, 'PLACEMENT_OFFICER maps to ADMIN module');
  assert(getProductModule(ROLES.COLLEGE_ADMIN) === MODULES.ADMIN, 'COLLEGE_ADMIN maps to ADMIN module');
  assert(getProductModule(ROLES.SUPER_ADMIN) === MODULES.ADMIN, 'SUPER_ADMIN maps to ADMIN module');

  // 2. Verify dashboard routing mapping
  assert(getDashboardRouteByRole(ROLES.STUDENT) === '/student/dashboard', 'STUDENT redirects to /student/dashboard');
  assert(getDashboardRouteByRole(ROLES.RECRUITER) === '/company/dashboard', 'RECRUITER redirects to /company/dashboard');
  assert(getDashboardRouteByRole(ROLES.COMPANY_HR) === '/company/dashboard', 'COMPANY_HR redirects to /company/dashboard');
  assert(getDashboardRouteByRole(ROLES.PLACEMENT_OFFICER) === '/admin/dashboard', 'PLACEMENT_OFFICER redirects to /admin/dashboard');
  assert(getDashboardRouteByRole(ROLES.COLLEGE_ADMIN) === '/admin/dashboard', 'COLLEGE_ADMIN redirects to /admin/dashboard');
  assert(getDashboardRouteByRole(ROLES.SUPER_ADMIN) === '/admin/dashboard', 'SUPER_ADMIN redirects to /admin/dashboard');

  console.log(`\n--- Test Results: ${passed}/${total} Passed ---`);
  if (passed === total) {
    console.log('SUCCESS: All Task 3 Role Consolidation Mapping Tests Passed!');
  } else {
    console.error('FAILURE: Some tests failed.');
    process.exit(1);
  }
}

runTests();
