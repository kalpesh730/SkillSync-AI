import { CompanyRepository } from './repositories/company.repository.js';
import { CompanyService } from './services/company.service.js';

async function runTests() {
  console.log('=== Running Company Ownership Security Tests ===\n');

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

  const companyAId = '65d1a2b3c4d5e6f7a8b9c0d1';
  const companyBId = '65d1a2b3c4d5e6f7a8b9c0d2';
  const tenantId = '65d1a2b3c4d5e6f7a8b9c000';
  const userId = '65d1a2b3c4d5e6f7a8b9c999';

  // Mock CompanyRepository.findById, update, and softDelete
  const originalFindById = CompanyRepository.findById;
  const originalUpdate = CompanyRepository.update;
  const originalSoftDelete = CompanyRepository.softDelete;

  CompanyRepository.findById = async (id) => {
    if (id === companyAId) {
      return { _id: companyAId, name: 'Company A', tenantId };
    }
    if (id === companyBId) {
      return { _id: companyBId, name: 'Company B', tenantId };
    }
    return null;
  };

  CompanyRepository.update = async (id, tenant, data) => {
    return { _id: id, ...data };
  };

  CompanyRepository.softDelete = async () => {
    return true;
  };

  try {
    // 1. RECRUITER from Company A updating Company A -> PASS
    try {
      const res = await CompanyService.updateCompany(companyAId, tenantId, userId, { name: 'Company A Updated' }, 'RECRUITER', companyAId);
      assert(res.name === 'Company A Updated', '1. RECRUITER from Company A can update Company A');
    } catch (e) {
      assert(false, `1. RECRUITER from Company A updating Company A failed: ${e.message}`);
    }

    // 2. RECRUITER from Company A updating Company B -> REJECTED (403)
    try {
      await CompanyService.updateCompany(companyBId, tenantId, userId, { name: 'Company B Hacked' }, 'RECRUITER', companyAId);
      assert(false, '2. RECRUITER from Company A updating Company B should be rejected');
    } catch (e) {
      assert(e.statusCode === 403, '2. RECRUITER from Company A updating Company B rejected with 403');
    }

    // 3. COMPANY_HR from Company A updating Company A -> PASS
    try {
      const res = await CompanyService.updateCompany(companyAId, tenantId, userId, { name: 'Company A Updated by HR' }, 'COMPANY_HR', companyAId);
      assert(res.name === 'Company A Updated by HR', '3. COMPANY_HR from Company A can update Company A');
    } catch (e) {
      assert(false, `3. COMPANY_HR from Company A updating Company A failed: ${e.message}`);
    }

    // 4. COMPANY_HR from Company A updating Company B -> REJECTED (403)
    try {
      await CompanyService.updateCompany(companyBId, tenantId, userId, { name: 'Company B Hacked' }, 'COMPANY_HR', companyAId);
      assert(false, '4. COMPANY_HR from Company A updating Company B should be rejected');
    } catch (e) {
      assert(e.statusCode === 403, '4. COMPANY_HR from Company A updating Company B rejected with 403');
    }

    // 5. RECRUITER from Company A deleting Company A -> PASS
    try {
      const res = await CompanyService.deleteCompany(companyAId, tenantId, userId, 'RECRUITER', companyAId);
      assert(res === true, '5. RECRUITER from Company A can delete Company A');
    } catch (e) {
      assert(false, `5. RECRUITER from Company A deleting Company A failed: ${e.message}`);
    }

    // 6. RECRUITER from Company A deleting Company B -> REJECTED (403)
    try {
      await CompanyService.deleteCompany(companyBId, tenantId, userId, 'RECRUITER', companyAId);
      assert(false, '6. RECRUITER from Company A deleting Company B should be rejected');
    } catch (e) {
      assert(e.statusCode === 403, '6. RECRUITER from Company A deleting Company B rejected with 403');
    }

    // 7. COMPANY_HR from Company A deleting Company A -> PASS
    try {
      const res = await CompanyService.deleteCompany(companyAId, tenantId, userId, 'COMPANY_HR', companyAId);
      assert(res === true, '7. COMPANY_HR from Company A can delete Company A');
    } catch (e) {
      assert(false, `7. COMPANY_HR from Company A deleting Company A failed: ${e.message}`);
    }

    // 8. COMPANY_HR from Company A deleting Company B -> REJECTED (403)
    try {
      await CompanyService.deleteCompany(companyBId, tenantId, userId, 'COMPANY_HR', companyAId);
      assert(false, '8. COMPANY_HR from Company A deleting Company B should be rejected');
    } catch (e) {
      assert(e.statusCode === 403, '8. COMPANY_HR from Company A deleting Company B rejected with 403');
    }

    // 9. Unauthorized / Non-company user (STUDENT) updating Company A -> REJECTED (403)
    try {
      await CompanyService.updateCompany(companyAId, tenantId, userId, { name: 'Hack' }, 'STUDENT', null);
      assert(false, '9. STUDENT updating Company A should be rejected');
    } catch (e) {
      assert(e.statusCode === 403, '9. STUDENT updating Company A rejected with 403');
    }

    // 10. Admin user (SUPER_ADMIN / COLLEGE_ADMIN) updating/deleting Company B -> PASS
    try {
      const resUpdate = await CompanyService.updateCompany(companyBId, tenantId, userId, { name: 'Admin Edit' }, 'SUPER_ADMIN', null);
      assert(resUpdate.name === 'Admin Edit', '10a. SUPER_ADMIN can update any company');

      const resDelete = await CompanyService.deleteCompany(companyBId, tenantId, userId, 'COLLEGE_ADMIN', null);
      assert(resDelete === true, '10b. COLLEGE_ADMIN can delete company under governance');
    } catch (e) {
      assert(false, `10. Admin operations failed: ${e.message}`);
    }

  } finally {
    // Restore originals
    CompanyRepository.findById = originalFindById;
    CompanyRepository.update = originalUpdate;
    CompanyRepository.softDelete = originalSoftDelete;
  }

  console.log(`\n--- Test Results: ${passed}/${total} Passed ---`);
  if (passed === total) {
    console.log('SUCCESS: All Company Ownership Security Tests Passed!');
  } else {
    console.error('FAILURE: Some tests failed.');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
