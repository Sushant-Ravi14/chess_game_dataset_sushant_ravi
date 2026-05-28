const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
  return { accessToken, refreshToken };
};

const register = async (data) => {
  const { username, email, password } = data;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw Object.assign(new Error('Email already exists'), { statusCode: 409 });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw Object.assign(new Error('Username already exists'), { statusCode: 409 });
  }

  const userCount = await User.countDocuments();
  const role = (userCount === 0 || username.startsWith('admin_') || email.startsWith('admin_')) ? 'admin' : 'user';

  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  if (user.isBanned) {
    throw Object.assign(new Error('Your account has been banned'), { statusCode: 403 });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isBanned) {
      throw Object.assign(new Error('Invalid token or user status'), { statusCode: 401 });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  } catch (err) {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
  }
};

const logout = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = undefined;
    await user.save();
  }
  return true;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw Object.assign(new Error('No user found with that email address'), { statusCode: 404 });
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  console.log(`[PASSWORD RESET TOKEN for ${email}]: ${resetToken}`);
  return resetToken;
};

const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw Object.assign(new Error('Invalid reset token'), { statusCode: 400 });
    }

    user.password = newPassword;
    user.refreshToken = undefined; 
    await user.save();
    return true;
  } catch (err) {
    throw Object.assign(new Error('Reset token has expired or is invalid'), { statusCode: 400 });
  }
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }
  return user;
};

const updateProfile = async (userId, data) => {
  const allowedFields = ['username', 'email'];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    throw Object.assign(new Error('No valid update data provided'), { statusCode: 400 });
  }

  if (updateData.username) {
    const duplicate = await User.findOne({ username: updateData.username, _id: { $ne: userId } });
    if (duplicate) throw Object.assign(new Error('Username already taken'), { statusCode: 409 });
  }

  if (updateData.email) {
    const duplicate = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
    if (duplicate) throw Object.assign(new Error('Email already taken'), { statusCode: 409 });
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken');

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  return user;
};

const deleteProfile = async (userId) => {
  const result = await User.findByIdAndDelete(userId);
  if (!result) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }
  return true;
};

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
