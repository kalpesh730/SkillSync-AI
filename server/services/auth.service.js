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

  const user = await User.create(data);

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
