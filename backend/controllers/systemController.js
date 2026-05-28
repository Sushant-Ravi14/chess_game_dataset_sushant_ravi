const mongoose = require('mongoose');
const { sendSuccess } = require('../utils/apiResponse');

const getHealth = (req, res) => {
  sendSuccess(res, 200, 'Server is healthy', {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
};

const getSystemInfo = (req, res) => {
  sendSuccess(res, 200, 'System info retrieved successfully', {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
};

const getSystemLogs = (req, res) => {
  // Mocking system logs
  const logs = [
    { timestamp: new Date().toISOString(), level: 'info', message: 'System startup initiated' },
    { timestamp: new Date().toISOString(), level: 'info', message: 'Database connected successfully' },
    { timestamp: new Date().toISOString(), level: 'info', message: 'API ready to accept connections' }
  ];
  sendSuccess(res, 200, 'System logs retrieved successfully', logs);
};

const getApiVersion = (req, res) => {
  // Reading from package.json or hardcoded
  const version = process.env.npm_package_version || '1.0.0';
  sendSuccess(res, 200, 'API version retrieved successfully', {
    version: version,
    environment: process.env.NODE_ENV || 'development'
  });
};

const getSystemStatus = (req, res) => {
  sendSuccess(res, 200, 'System status retrieved successfully', {
    status: 'online',
    databaseState: mongoose.connection.readyState,
    databaseHost: mongoose.connection.host,
    databasePort: mongoose.connection.port,
  });
};

module.exports = {
  getHealth,
  getSystemInfo,
  getSystemLogs,
  getApiVersion,
  getSystemStatus,
};
