import Job from './models/Job.js';
import Application from './models/Application.js';
import { AnalyticsService } from './services/analytics/analytics.service.js';

async function runTests() {
  console.log('=== Running Task 4 Company Dashboard Security & Isolation Tests ===\n');

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

  const companyAId = '65d1a2b3c4d5e6f7a8b9c0a1';
  const companyBId = '65d1a2b3c4d5e6f7a8b9c0b2';

  // Mock Job.find and Application.find
  const originalJobFind = Job.find;
  const originalAppFind = Application.find;

  const mockJobs = [
    { _id: 'jobA1', title: 'Company A Engineer', companyId: companyAId, status: 'PUBLISHED', isDeleted: false, createdAt: new Date() },
    { _id: 'jobA2', title: 'Company A Designer', companyId: companyAId, status: 'DRAFT', isDeleted: false, createdAt: new Date() },
    { _id: 'jobB1', title: 'Company B Manager', companyId: companyBId, status: 'PUBLISHED', isDeleted: false, createdAt: new Date() }
  ];

  const mockApps = [
    { _id: 'appA1', companyId: companyAId, jobId: { _id: 'jobA1', title: 'Company A Engineer' }, studentId: { name: 'Alice' }, status: 'APPLIED', isDeleted: false, appliedAt: new Date() },
    { _id: 'appB1', companyId: companyBId, jobId: { _id: 'jobB1', title: 'Company B Manager' }, studentId: { name: 'Bob' }, status: 'APPLIED', isDeleted: false, appliedAt: new Date() }
  ];

  Job.find = (filter) => {
    const filterCompanyId = filter.companyId?.toString();
    const filtered = mockJobs.filter(j => j.companyId === filterCompanyId && !j.isDeleted);
    return {
      sort: () => ({
        lean: async () => filtered
      }),
      lean: async () => filtered
    };
  };

  Application.find = (filter) => {
    const filterCompanyId = filter.companyId?.toString();
    const filtered = mockApps.filter(a => a.companyId === filterCompanyId && !a.isDeleted);
    return {
      sort: () => ({
        populate: () => ({
          populate: () => ({
            lean: async () => filtered
          })
        })
      }),
      lean: async () => filtered
    };
  };

  try {
    // 1. Fetch Company A Dashboard Analytics
    const dataA = await AnalyticsService.getCompanyAnalytics(companyAId);

    assert(dataA.jobs.total === 2, 'Company A sees total 2 jobs (excludes Company B)');
    assert(dataA.jobs.published === 1, 'Company A sees 1 published job');
    assert(dataA.applications.total === 1, 'Company A sees total 1 application (excludes Company B)');
    assert(dataA.jobs.recent.length === 2, 'Company A sees 2 recent vacancies');
    assert(dataA.jobs.recent.every(j => j.companyId === companyAId), 'Company A recent vacancies contain only Company A jobs');
    assert(dataA.applications.recent.length === 1, 'Company A sees 1 recent application');
    assert(dataA.applications.recent.every(a => a.companyId === companyAId), 'Company A recent applications contain only Company A apps');

    // 2. Fetch Company B Dashboard Analytics
    const dataB = await AnalyticsService.getCompanyAnalytics(companyBId);

    assert(dataB.jobs.total === 1, 'Company B sees total 1 job (excludes Company A)');
    assert(dataB.jobs.published === 1, 'Company B sees 1 published job');
    assert(dataB.applications.total === 1, 'Company B sees total 1 application (excludes Company A)');
    assert(dataB.jobs.recent.every(j => j.companyId === companyBId), 'Company B recent vacancies contain only Company B jobs');

  } finally {
    Job.find = originalJobFind;
    Application.find = originalAppFind;
  }

  console.log(`\n--- Test Results: ${passed}/${total} Passed ---`);
  if (passed === total) {
    console.log('SUCCESS: All Company Dashboard Security & Isolation Tests Passed!');
  } else {
    console.error('FAILURE: Some tests failed.');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
