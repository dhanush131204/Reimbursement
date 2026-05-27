import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewClaim from './pages/NewClaim';
import Register from './pages/Register';
import Approved from './pages/Approved';
import Pending from './pages/Pending';
import Rejected from './pages/Rejected';
import ExpenseHistory from './pages/ExpenseHistory';
import Settings from './pages/Settings';
import Payments from './pages/Payments';
import AdminUsers from './pages/AdminUsers';
import AdminUserForm from './pages/AdminUserForm';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const storedUser = localStorage.getItem('userInfo');
  const isAuthenticated = userInfo || (storedUser && JSON.parse(storedUser));
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="claims" element={<ExpenseHistory />} />
        <Route path="claims/new" element={<NewClaim />} />
        <Route path="approved" element={<Approved />} />
        <Route path="pending" element={<Pending />} />
        <Route path="rejected" element={<Rejected />} />
        <Route path="history" element={<ExpenseHistory />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/new" element={<AdminUserForm />} />
        <Route path="users/:id/edit" element={<AdminUserForm />} />
        <Route path="payments" element={<Payments />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
