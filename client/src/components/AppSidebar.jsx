import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  CircleCheckBig,
  Clock3,
  CircleX,
  CreditCard,
  History,
  Settings,
  UserRound,
  LogOut,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Frame1Image from '../assets/image/Frame1.png';

const employeeNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'New Request', path: '/claims/new', icon: PlusCircle },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const adminNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Add User', path: '/users', icon: PlusCircle },
  { name: 'Batch Payments', path: '/payments', icon: CreditCard },
  { name: 'Profile', path: '/settings', icon: UserRound },
];

const AppSidebar = ({ onLogout, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.role === 'ADMIN';
  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  const goTo = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside className="flex h-screen min-h-0 w-full flex-col border-r border-[#d7e4ea] bg-[#f0fbff]">
      <div className="flex h-[78px] items-center px-5">
        <img src={Frame1Image} alt="Third Vizion" className="h-12 w-full object-contain object-left" />
      </div>

      <nav className={`flex-1 min-h-0 px-3 overflow-y-auto ${isAdmin ? 'space-y-2 py-5' : 'space-y-1.5 py-02'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === '/history' && location.pathname === '/claims') ||
            (item.path === '/users' && location.pathname.startsWith('/users')) ||
            (item.path === '/settings' && location.pathname === '/settings');
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => goTo(item.path)}
              className={`relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${isAdmin ? 'text-xs' : 'text-sm'} ${
                isActive ? 'bg-[#d8f5ff] font-semibold text-[#172033]' : 'text-[#7a8793] hover:bg-white hover:text-[#172033]'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#00aeef]' : 'text-[#9aa4ad]'}`} />
              <span>{item.name}</span>
              {isActive && <span className="absolute right-0 top-0 h-full w-1 bg-[#00aeef]" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto bg-[#f0fbff] border-t border-[#d7e4ea] p-3">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-[#ef4444] hover:bg-[#fffaf9] text-left flex items-center gap-3"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
