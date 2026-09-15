import crypto from 'crypto';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { StudentService } from './student.service.js';

export const registerUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  // Allowed public registration roles (STUDENT, RECRUITER, COMPANY_HR).
  // Admin module roles (SUPER_ADMIN, COLLEGE_ADMIN, PLACEMENT_OFFICER) are strictly protected against public self-registration.
  const allowedPublicRoles = ['STUDENT', 'RECRUITER', 'COMPANY_HR'];
  const assignedRole = allowedPublicRoles.includes(data.role) ? data.role : 'STUDENT';

  const safeData = {
    ...data,
    role: assignedRole,
  };
  // Public registration should not allow tenantId or companyId assignment.
  if (safeData.tenantId) delete safeData.tenantId;
  if (safeData.companyId) delete safeData.companyId;

  const user = await User.create(safeData);

  if (user.role === 'STUDENT') {
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || ' ';
    await StudentService.createInitialProfile(user._id, user.tenantId, firstName, lastName, user.email);
  }

  // Convert mongoose document to object and remove password
  const userObj = user.toObject();
  delete userObj.password;

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
    tenantId: user.tenantId,
    companyId: user.companyId
  });
  const refreshToken = generateRefreshToken({ id: user._id });

  return { user: userObj, accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const userObj = user.toObject();
  delete userObj.password;

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
    tenantId: user.tenantId,
    companyId: user.companyId
  });
  const refreshToken = generateRefreshToken({ id: user._id });

  return { user: userObj, accessToken, refreshToken };
};

export const refreshUserToken = async (token) => {
  if (!token) {
    const error = new Error('No refresh token provided');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
      tenantId: user.tenantId,
      companyId: user.companyId
    });
    return { accessToken };
  } catch (err) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { success: true };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await user.save({ validateBeforeSave: false });

  // Ready for email delivery: In a production setup with SMTP/SES, reset email with token link is dispatched here.
  return { success: true, resetToken, email: user.email };
};

export const resetPasswordWithToken = async (token, newPassword) => {
  if (!token) {
    const error = new Error('Reset token is required');
    error.statusCode = 400;
    throw error;
  }

  const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error('Invalid or expired password reset token');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return { success: true };
};
