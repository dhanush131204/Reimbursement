import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import AppSidebar from '../components/AppSidebar';
import TopBar from '../components/TopBar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-[#111827]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[220px] shrink-0 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AppSidebar onLogout={handleLogout} onNavigate={() => setSidebarOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar user={userInfo} onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white px-6 py-6">
          <div className="mx-auto w-full max-w-[1240px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
