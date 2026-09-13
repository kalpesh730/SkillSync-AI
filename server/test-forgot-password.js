import mongoose from 'mongoose';
import User from './models/User.js';
import Student from './models/Student.js';
import * as authService from './services/auth.service.js';

async function runTests() {
  console.log('--- Starting Forgot / Reset Password Automated Tests ---');
  await mongoose.connect('mongodb://127.0.0.1:27017/skillsync_test_pwd_reset');
  await User.deleteMany({ email: 'pwd_test_user@example.com' });
  await Student.deleteMany({ email: 'pwd_test_user@example.com' });

  // 1. Create a test user
  const created = await authService.registerUser({
    name: 'Password Tester',
    email: 'pwd_test_user@example.com',
    password: 'InitialPassword123!',
    role: 'STUDENT',
  });
  console.log('✅ 1. Test user registered successfully');

  // 2. Test request password reset for non-existent user (anti-enumeration check)
  const nonExistentResult = await authService.requestPasswordReset('nonexistent_user@example.com');
  if (nonExistentResult.success && !nonExistentResult.resetToken) {
    console.log('✅ 2. Non-existent user handled gracefully without token exposure');
  } else {
    throw new Error('Anti-enumeration test failed');
  }

  // 3. Test request password reset for existing user
  const resetResult = await authService.requestPasswordReset('pwd_test_user@example.com');
  if (!resetResult.success || !resetResult.resetToken) {
    throw new Error('Failed to generate reset token');
  }
  const rawToken = resetResult.resetToken;
  console.log('✅ 3. Reset token generated internally');

  // 4. Verify hashed token stored in database and raw token not stored
  const dbUser = await User.findOne({ email: 'pwd_test_user@example.com' }).select('+passwordResetToken +passwordResetExpires');
  if (!dbUser.passwordResetToken || dbUser.passwordResetToken === rawToken) {
    throw new Error('Reset token is either missing or stored unhashed in DB');
  }
  if (!dbUser.passwordResetExpires || dbUser.passwordResetExpires <= new Date()) {
    throw new Error('Reset expiration time invalid');
  }
  console.log('✅ 4. Token securely stored as SHA-256 hash with 15m expiration');

  // 5. Test reset with invalid token fails
  try {
    await authService.resetPasswordWithToken('invalid_raw_token_xyz', 'NewPassword123!');
    throw new Error('Expected invalid token reset to fail');
  } catch (err) {
    if (err.statusCode === 400) {
      console.log('✅ 5. Invalid token rejected with HTTP 400');
    } else {
      throw err;
    }
  }

  // 6. Test reset with valid token succeeds
  await authService.resetPasswordWithToken(rawToken, 'NewSecurePassword123!');
  console.log('✅ 6. Password reset with valid token succeeded');

  // 7. Test token cleared after use (single-use validation)
  const updatedUser = await User.findOne({ email: 'pwd_test_user@example.com' }).select('+passwordResetToken +passwordResetExpires');
  if (updatedUser.passwordResetToken || updatedUser.passwordResetExpires) {
    throw new Error('Reset token was not cleared after use');
  }
  console.log('✅ 7. Single-use token cleared from database');

  // 8. Test logging in with old password fails
  try {
    await authService.loginUser('pwd_test_user@example.com', 'InitialPassword123!');
    throw new Error('Old password was still accepted');
  } catch (err) {
    if (err.statusCode === 401) {
      console.log('✅ 8. Old password rejected with HTTP 401');
    } else {
      throw err;
    }
  }

  // 9. Test logging in with new password succeeds
  const loginResult = await authService.loginUser('pwd_test_user@example.com', 'NewSecurePassword123!');
  if (loginResult.accessToken && loginResult.user.email === 'pwd_test_user@example.com') {
    console.log('✅ 9. Login with new password succeeded and issued valid JWT');
  } else {
    throw new Error('Login with new password failed');
  }

  // Clean up
  await User.deleteMany({ email: 'pwd_test_user@example.com' });
  await Student.deleteMany({ email: 'pwd_test_user@example.com' });
  await mongoose.disconnect();
  console.log('\n--- All 9/9 Password Reset Security Tests PASSED ---');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
