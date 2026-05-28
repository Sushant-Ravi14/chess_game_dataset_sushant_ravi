const User = require('../models/User');
const Match = require('../models/Match');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

const getUsersList = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password -refreshToken');
  sendSuccess(res, 200, 'Registered users list retrieved successfully', users);
});

const getLogs = asyncHandler(async (req, res) => {
  const logs = [
    { timestamp: new Date().toISOString(), level: 'info', message: 'System initialized' },
    { timestamp: new Date().toISOString(), level: 'info', message: 'Database connection established' }
  ];
  sendSuccess(res, 200, 'System logs retrieved successfully', logs);
});

const getSystemHealth = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Server is healthy', {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memoryUsage: process.memoryUsage(),
  });
});

const clearCache = asyncHandler(async (req, res) => {
  // Mock cache clearing
  sendSuccess(res, 200, 'System cache cleared successfully');
});

const banUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }
  user.isBanned = true;
  user.refreshToken = undefined; // invalidate session
  await user.save();
  sendSuccess(res, 200, `User ${user.username} banned successfully`, { username: user.username, isBanned: true });
});

const unbanUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }
  user.isBanned = false;
  await user.save();
  sendSuccess(res, 200, `User ${user.username} unbanned successfully`, { username: user.username, isBanned: false });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const bannedUsers = await User.countDocuments({ isBanned: true });
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const totalMatches = await Match.countDocuments();
  const deletedMatches = await Match.countDocuments({ isDeleted: true });
  const archivedMatches = await Match.countDocuments({ isArchived: true });

  sendSuccess(res, 200, 'Admin dashboard statistics retrieved successfully', {
    users: {
      total: totalUsers,
      banned: bannedUsers,
      admins: adminUsers
    },
    matches: {
      total: totalMatches,
      deleted: deletedMatches,
      archived: archivedMatches
    }
  });
});

module.exports = {
  getUsersList,
  getLogs,
  getSystemHealth,
  clearCache,
  banUser,
  unbanUser,
  getDashboardStats,
};
