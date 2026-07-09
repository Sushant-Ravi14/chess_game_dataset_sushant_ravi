import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../store/slices/authSlice';
import { CircularProgress } from '@mui/material';
import { Crown, Eye, EyeOff } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      // Admin registration expects confirmPassword to match password in the backend
      const resultAction = await dispatch(registerUser(values));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] p-4 transition-colors">
      <Helmet>
        <title>Sign Up | ChessAnalytics</title>
      </Helmet>
      <div className="max-w-[410px] w-full bg-white dark:bg-[#111420] border border-slate-200 dark:border-[#1a1f33] rounded-[2rem] shadow-xl p-8 sm:p-10 space-y-6">
        
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2.5">
          <div className="bg-blue-500 p-2 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">ChessAnalytics</h1>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-1 mt-1.5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">Join us to get started</p>
        </div>

        {/* Toggle removed */}

        {error && (
          <div className="bg-red-50 text-red-600 p-2.5 rounded-lg text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 pt-1.5">
          {/* Name */}
          <div>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Full Name"
              className={`w-full px-4 py-3 rounded-xl border ${
                formik.touched.username && formik.errors.username
                  ? 'border-red-500'
                  : 'border-slate-200 dark:border-slate-600'
              } bg-transparent dark:text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[13px]`}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-xs text-red-500 px-1">{formik.errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              className={`w-full px-4 py-3 rounded-xl border ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : 'border-slate-200 dark:border-slate-600'
              } bg-transparent dark:text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[13px]`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-500 px-1">{formik.errors.email}</p>
            )}
          </div>
          
          {/* Password */}
          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`w-full pl-4 pr-10 py-3 rounded-xl border ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-500'
                    : 'border-slate-200 dark:border-slate-600'
                } bg-transparent dark:text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[13px]`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-500 px-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className={`w-full pl-4 pr-10 py-3 rounded-xl border ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-slate-200 dark:border-slate-600'
                } bg-transparent dark:text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[13px]`}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 px-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-3 bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white font-medium rounded-full transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center text-[13px]"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-[13px] text-slate-600 dark:text-slate-500 dark:text-slate-400 pt-3">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
