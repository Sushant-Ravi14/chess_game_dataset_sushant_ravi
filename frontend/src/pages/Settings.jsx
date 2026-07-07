import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleHighContrast } from '../store/slices/uiSlice';
import { toast } from 'react-hot-toast';
import { Palette, Monitor } from 'lucide-react';

const Settings = () => {
  const dispatch = useDispatch();
  const { theme, highContrast } = useSelector((state) => state.ui);

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Settings | ChessAnalytics</title>
      </Helmet>
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Customize your dashboard experience and preferences</p>
      </div>

      <div className="bg-white dark:bg-[#111420] rounded-[2rem] border border-slate-200 dark:border-[#1a1f33] shadow-xl overflow-hidden">
        
        {/* Appearance Section */}
        <div className="p-8 border-b border-slate-200 dark:border-[#1a1f33]">
          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200">Dark Mode</p>
              </div>
              
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                onClick={() => dispatch(toggleTheme())}
                className={`${
                  theme === 'dark' ? 'bg-blue-500' : 'bg-slate-100 dark:bg-[#1a1f33]'
                } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-[#111420] shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>          
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Settings;
