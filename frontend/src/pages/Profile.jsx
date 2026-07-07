import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { updateUser } from '../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import { User, Mail } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [saving, setSaving] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: user?.name || '',
      email: user?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const res = await api.put('/admin/auth/profile', {
          name: values.username,
          email: values.email
        });
        const updatedUser = res.data.data?.user || res.data.user;
        dispatch(updateUser(updatedUser));
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
      } finally {
        setSaving(false);
      }
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Helmet>
        <title>My Profile | ChessAnalytics</title>
      </Helmet>
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Profile Display */}
        <div className="bg-white dark:bg-[#111420] rounded-[2rem] border border-slate-200 dark:border-[#1a1f33] shadow-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#93C5FD] to-[#3B82F6] shadow-[0_0_40px_rgba(59, 130, 246,0.3)] flex items-center justify-center mb-6">
            <span className="text-5xl font-black text-white">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user?.name || 'Admin User'}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{user?.email || 'admin@example.com'}</p>
          
          <div className="px-6 py-1.5 rounded-full bg-slate-100 dark:bg-[#1a1f33] border border-[#2d3748]">
            <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase">
              {user?.role || 'ADMIN'}
            </span>
          </div>
        </div>

        {/* Right Card: Edit Information Form */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111420] rounded-[2rem] border border-slate-200 dark:border-[#1a1f33] shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-200 dark:border-[#1a1f33]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Information</h2>
          </div>
          
          <div className="p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-xl">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-300 mb-2">
                  <User size={16} /> Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`w-full px-4 py-3.5 rounded-xl border ${
                    formik.touched.username && formik.errors.username
                      ? 'border-red-500/50'
                      : 'border-[#DFE5ED] dark:border-[#2d3748]'
                  } bg-slate-50 dark:bg-[#161a28] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium`}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={saving}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="mt-2 text-xs text-red-400">{formik.errors.username}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-300 mb-2">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`w-full px-4 py-3.5 rounded-xl border ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500/50'
                      : 'border-[#DFE5ED] dark:border-[#2d3748]'
                  } bg-slate-50 dark:bg-[#161a28] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium opacity-70 cursor-not-allowed`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={true}
                  readOnly
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-xs text-red-400">{formik.errors.email}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving || !formik.dirty}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                >
                  {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
