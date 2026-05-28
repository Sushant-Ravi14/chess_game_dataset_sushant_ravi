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

const getUptime = (req, res) => {
  const uptimeSeconds = process.uptime();
  const uptimeFormatted = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);
  sendSuccess(res, 200, 'Server uptime retrieved successfully', {
    uptimeSeconds,
    uptimeFormatted,
    startedAt: new Date(Date.now() - uptimeSeconds * 1000).toISOString(),
  });
};

const getDatabaseStatus = (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  
  sendSuccess(res, 200, 'Database health check retrieved successfully', {
    status: state === 1 ? 'healthy' : 'unhealthy',
    connectionState: states[state] || 'unknown',
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  });
};

const getCacheStatus = (req, res) => {
  // Mock cache status since we don't have Redis configured
  sendSuccess(res, 200, 'Cache health check retrieved successfully', {
    status: 'healthy',
    provider: 'memory-mock',
    hits: Math.floor(Math.random() * 10000),
    misses: Math.floor(Math.random() * 500),
    keys: Math.floor(Math.random() * 2000),
  });
};

const recalculateStats = (req, res) => {
  // Mock recalculation
  sendSuccess(res, 200, 'Stats recalculation job initiated successfully. This may take a few minutes to reflect across all dashboards.');
};

const reindexSearch = (req, res) => {
  // Mock reindexing
  sendSuccess(res, 200, 'Search database reindexing job initiated successfully.');
};

module.exports = {
  getHealth,
  getSystemInfo,
  getSystemLogs,
  getApiVersion,
  getSystemStatus,
  getUptime,
  getDatabaseStatus,
  getCacheStatus,
  recalculateStats,
  reindexSearch,
};
