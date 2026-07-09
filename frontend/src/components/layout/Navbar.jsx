import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// removed
import { logout } from '../../store/slices/authSlice';
import { LogOut, User, Settings as SettingsIcon } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-0">
      <header className="bg-white dark:bg-[#111420] border border-slate-200 dark:border-[#1a1f33] rounded-3xl h-16 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          
          <h2 className="text-slate-900 dark:text-white font-medium flex items-center gap-2">
            Welcome back, {user?.username || 'Admin'} 
          </h2>
        </div>

        <div className="relative" ref={menuRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer p-1 pr-1 rounded-full border border-slate-200 hover:bg-slate-100 dark:bg-[#1a1f33] transition-colors" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="flex items-center justify-center bg-gradient-to-b from-[#93C5FD] to-[#3B82F6] text-white font-black w-8 h-8 rounded-full shadow-[0_0_15px_rgba(59, 130, 246,0.3)]">
              {user?.username?.charAt(0) || 'A'}
            </div>
          </div>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-slate-50 dark:bg-[#161a28] rounded-2xl shadow-xl border border-slate-200 dark:border-[#1a1f33] overflow-hidden z-50">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-[#1a1f33]">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.username || 'Admin User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email || 'admin@example.com'}</p>
              </div>
              
              <div className="py-2">
                <button 
                  onClick={() => handleNavigate('/profile')} 
                  className="w-full flex items-center px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-[#1a1f33] transition-colors"
                >
                  <User size={16} className="mr-3 text-slate-500 dark:text-slate-400" /> My Profile
                </button>
                <button 
                  onClick={() => handleNavigate('/settings')} 
                  className="w-full flex items-center px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-[#1a1f33] transition-colors"
                >
                  <SettingsIcon size={16} className="mr-3 text-slate-500 dark:text-slate-400" /> Settings
                </button>
              </div>
              
              <div className="border-t border-slate-200 dark:border-[#1a1f33] py-2">
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-colors"
                >
                  <LogOut size={16} className="mr-3" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
