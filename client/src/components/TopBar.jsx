import { Menu } from 'lucide-react';
import { Avatar } from 'antd';

const TopBar = ({ user, onMenu }) => (
  <header className="flex h-14 items-center justify-between border-b border-[#d7e4ea] bg-white px-5">
    <button
      type="button"
      onClick={onMenu}
      className="flex h-9 w-9 items-center justify-center rounded-md text-[#64748b] hover:bg-[#f0fbff] lg:hidden"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>

    <div className="ml-auto flex items-center gap-3">
      <div className="text-right">
        <p className="text-xs font-semibold leading-tight text-[#111827]">{user?.name || 'User'}</p>
        <p className="text-[10px] leading-tight text-[#64748b]">{user?.designation || (user?.role === 'ADMIN' ? 'Admin' : 'Employee')}</p>
      </div>
      <Avatar size={34} className="bg-[#d8f5ff] text-[#00aeef]">
        {user?.name?.charAt(0) || 'U'}
      </Avatar>
    </div>
  </header>
);

export default TopBar;
