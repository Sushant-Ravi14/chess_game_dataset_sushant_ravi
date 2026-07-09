import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  BarChart3, 
  Settings,
  Crown
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/matches', label: 'Matches', icon: Database },
  { path: '/users', label: 'Players', icon: Users },
  { path: '/analytics', label: 'Openings Theory', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: Settings },
];

const Sidebar = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-50 dark:bg-[#0b0f19]/80 z-40 xl:hidden backdrop-blur-sm"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed xl:sticky top-0 left-0 z-50 h-screen w-[260px] bg-white dark:bg-[#111420] border-r border-slate-200 dark:border-[#1a1f33] transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        }`}
      >
        <div className="h-18 flex items-center px-6 border-b border-slate-200 dark:border-[#1a1f33]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center shrink-0">
              <Crown size={18} className="text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                ChessAnalytics
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-[#1a1f33] hover:text-slate-900 dark:text-white'
                }`
              }
            >
              <item.icon size={20} className="shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
