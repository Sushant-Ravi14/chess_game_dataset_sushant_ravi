const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendSuccess(res, 201, 'User registered successfully', result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, 200, 'User logged in successfully', result);
});

const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    throw Object.assign(new Error('Refresh token is required'), { statusCode: 400 });
  }
  const result = await authService.refreshToken(token);
  sendSuccess(res, 200, 'Access token refreshed successfully', result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  sendSuccess(res, 200, 'User logged out successfully');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw Object.assign(new Error('Email is required'), { statusCode: 400 });
  }
  const resetToken = await authService.forgotPassword(email);
  sendSuccess(res, 200, 'Password reset token generated (Logged to console)', { resetToken });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    throw Object.assign(new Error('Token and password are required'), { statusCode: 400 });
  }
  await authService.resetPassword(token, password);
  sendSuccess(res, 200, 'Password reset successfully');
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  sendSuccess(res, 200, 'User profile retrieved successfully', user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  sendSuccess(res, 200, 'User profile updated successfully', user);
});

const deleteProfile = asyncHandler(async (req, res) => {
  await authService.deleteProfile(req.user._id);
  sendSuccess(res, 200, 'User profile deleted successfully');
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteProfile,
};
