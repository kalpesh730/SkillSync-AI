import mongoose from 'mongoose';
import User from './models/User.js';
import Student from './models/Student.js';
import * as authService from './services/auth.service.js';

async function runTests() {
  await mongoose.connect('mongodb://127.0.0.1:27017/skillsync_test_sec_2');
  await User.deleteMany({});
  await Student.deleteMany({});

  const tests = [
    {
      name: 'A. Normal registration',
      payload: { name: 'Normal User', email: 'normal@test.com', password: 'password123' },
      expectedRole: 'STUDENT',
      expectedTenant: undefined,
    },
    {
      name: 'B. SUPER_ADMIN attack',
      payload: { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'SUPER_ADMIN' },
      expectedRole: 'STUDENT',
      expectedTenant: undefined,
    },
    {
      name: 'C. COLLEGE_ADMIN attack',
      payload: { name: 'College Admin', email: 'college@test.com', password: 'password123', role: 'COLLEGE_ADMIN' },
      expectedRole: 'STUDENT',
      expectedTenant: undefined,
    },
    {
      name: 'D. RECRUITER attack',
      payload: { name: 'Recruiter User', email: 'recruiter@test.com', password: 'password123', role: 'RECRUITER' },
      expectedRole: 'STUDENT',
      expectedTenant: undefined,
    },
    {
      name: 'E. Tenant attack',
      payload: { name: 'Tenant User', email: 'tenant@test.com', password: 'password123', tenantId: new mongoose.Types.ObjectId().toString() },
      expectedRole: 'STUDENT',
      expectedTenant: undefined,
    },
    {
      name: 'F. Combined attack',
      payload: { name: 'Hacker User', email: 'hacker@test.com', password: 'password123', role: 'SUPER_ADMIN', tenantId: new mongoose.Types.ObjectId().toString() },
      expectedRole: 'STUDENT',
      expectedTenant: undefined,
    },
    {
      name: 'G. Unknown fields',
      payload: { name: 'Unknown User', email: 'unknown@test.com', password: 'password123', role: 'SUPER_ADMIN', companyId: new mongoose.Types.ObjectId().toString(), isAdmin: true },
      expectedRole: 'STUDENT',
      expectedTenant: undefined,
    },
  ];

  let passed = 0;
  for (const test of tests) {
    try {
      const result = await authService.registerUser(test.payload);
      const dbUser = await User.findById(result.user._id);

      let success = true;
      if (dbUser.role !== test.expectedRole) {
        console.error(`❌ [FAIL] ${test.name}: Expected role ${test.expectedRole}, got ${dbUser.role}`);
        success = false;
      }
      if (dbUser.tenantId !== test.expectedTenant && dbUser.tenantId?.toString() !== test.expectedTenant) {
        console.error(`❌ [FAIL] ${test.name}: Expected tenantId ${test.expectedTenant}, got ${dbUser.tenantId}`);
        success = false;
      }
      
      if (test.name === 'G. Unknown fields') {
         if (dbUser.companyId) {
             console.error(`❌ [FAIL] ${test.name}: companyId was set!`);
             success = false;
         }
      }

      if (success) {
        console.log(`✅ [PASS] ${test.name}`);
        passed++;
      }
    } catch (e) {
      console.error(`❌ [ERROR] ${test.name}:`, e.message);
    }
  }

  console.log(`\n--- Test Results: ${passed}/${tests.length} Passed ---`);
  await mongoose.disconnect();
}

runTests().catch(console.error);
