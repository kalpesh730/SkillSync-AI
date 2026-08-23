import { requireTenantContext } from './middlewares/tenant.middleware.js';

function runTests() {
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

  const runMiddleware = (req) => {
    return new Promise((resolve, reject) => {
      requireTenantContext(req, {}, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };

  // TEST A: User with trusted tenantId
  const reqA = { user: { role: 'STUDENT', tenantId: 'TENANT_A' } };
  runMiddleware(reqA)
    .then(() => assert(true, 'Test A: User with trusted tenantId allowed'))
    .catch(() => assert(false, 'Test A: User with trusted tenantId allowed'));

  // TEST B: User without tenantId
  const reqB = { user: { role: 'STUDENT' } }; // tenantId undefined
  runMiddleware(reqB)
    .then(() => assert(false, 'Test B: User without tenantId should be blocked'))
    .catch((err) => {
      if (err.statusCode === 403) assert(true, 'Test B: User without tenantId blocked with 403');
      else assert(false, 'Test B: Wrong error code');
    });

  // TEST C: User with tenantId = TENANT_A but request body contains: tenantId = TENANT_B
  const reqC = { user: { role: 'STUDENT', tenantId: 'TENANT_A' }, body: { tenantId: 'TENANT_B' } };
  runMiddleware(reqC)
    .then(() => {
      assert(true, 'Test C: User with Tenant A allowed despite body containing Tenant B');
      assert(reqC.user.tenantId === 'TENANT_A', 'Test C: req.user.tenantId remains TENANT_A');
    })
    .catch(() => assert(false, 'Test C: Failed'));

  // TEST D: User without tenantId but request body contains: tenantId = TENANT_B
  const reqD = { user: { role: 'STUDENT' }, body: { tenantId: 'TENANT_B' } };
  runMiddleware(reqD)
    .then(() => assert(false, 'Test D: User without tenantId with body.tenantId should be blocked'))
    .catch((err) => {
      if (err.statusCode === 403) assert(true, 'Test D: User without tenantId blocked with 403 even with body.tenantId');
      else assert(false, 'Test D: Wrong error code');
    });
}

runTests();
