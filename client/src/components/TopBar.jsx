import { Pencil, Menu } from 'lucide-react';
import { Avatar } from 'antd';

const TopBar = ({ user, onMenu, onProfile }) => (
  <header className="flex h-14 items-center justify-between border-b border-[#cfe6ef] bg-white px-5">
    <button
      type="button"
      onClick={onMenu}
      className="flex h-9 w-9 items-center justify-center rounded-md text-[#64748b] hover:bg-[#f0fbff] lg:hidden"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>

    <button
      type="button"
      onClick={onProfile}
      className="ml-auto flex items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[#f0fbff] focus:outline-none focus:ring-2 focus:ring-[#00aeef]/40"
      aria-label="Edit profile"
    >
      <div className="text-right">
        <p className="text-xs font-semibold leading-tight text-[#111827]">{user?.name || 'User'}</p>
        <p className="text-[10px] leading-tight text-[#64748b]">{user?.designation || (user?.role === 'ADMIN' ? 'Admin' : 'Employee')}</p>
      </div>
      <span className="relative inline-flex">
        <Avatar
          size={34}
          src={user?.profileImageUrl
            ? user.profileImageUrl.startsWith('http')
              ? user.profileImageUrl
              : `http://localhost:5000${user.profileImageUrl}`
            : user?.role === 'ADMIN'
              ? 'https://i.pravatar.cc/80?img=12'
              : undefined}
          className="bg-[#d8f5ff] text-[#00aeef]"
        >
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00aeef] text-white ring-2 ring-white">
          <Pencil className="h-2.5 w-2.5" />
        </span>
      </span>
    </button>
  </header>
);

export default TopBar;
