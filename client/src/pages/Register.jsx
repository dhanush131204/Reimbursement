import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../store/apiSlice';
import { setCredentials } from '../store/authSlice';
import { Form, Input, Button, message } from 'antd';
import { Mail, Lock, User, Phone } from 'lucide-react';
import leftBrandImage from '../assets/image/LeftBrand.png';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [roleView, setRoleView] = useState('employee');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerApi] = useRegisterMutation();

  const onFinish = async (values) => {
    if (roleView === 'admin') {
      message.error('Admin registration is disabled. Please use Admin login.');
      return;
    }

    try {
      setLoading(true);
      const res = await registerApi({
        name: values.name,
        email: values.email,
        password: values.password,
        contactNumber: values.contactNumber,
      }).unwrap();
      dispatch(setCredentials(res));
      message.success('Registration successful!');
      navigate('/');
    } catch (err) {
      message.error(err?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex lg:h-screen lg:overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
      <div className="hidden lg:block lg:w-1/2 lg:h-screen overflow-hidden">
        <img src={leftBrandImage} alt="Third Vizion Brand" className="w-full h-full object-cover" />
      </div>

      <div className="w-full lg:w-1/2 min-h-screen flex items-start lg:items-center justify-center px-6 py-8 overflow-y-auto bg-white">
        <div className="w-full max-w-sm my-auto">
          <h1 className="text-3xl font-semibold mb-5 text-center tracking-tight" style={{ color: '#00aeef' }}>
            Create Account..!
          </h1>

          <div className="w-full flex justify-center mb-4">
            <div className="inline-flex items-center p-1 lg:rounded-4xl border border-[#e5e7eb] bg-white shadow-md">
              <button
                type="button"
                onClick={() => setRoleView('employee')}
                className="px-4 py-2 text-xs md:rounded-4xl transition-colors"
                style={{
                  backgroundColor: roleView === 'employee' ? '#00aeef' : 'transparent',
                  color: roleView === 'employee' ? '#ffffff' : '#111827',
                }}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setRoleView('admin')}
                className="px-4 py-2 text-xs md:rounded-4xl transition-colors"
                style={{
                  backgroundColor: roleView === 'admin' ? '#00aeef' : 'transparent',
                  color: roleView === 'admin' ? '#ffffff' : '#111827',
                }}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#e7eaf0] shadow-md p-6">
            <h2 className="text-lg font-semibold mb-1" style={{ color: '#00aeef' }}>
              Sign Up
            </h2>
            <p className="text-[10px] mb-5" style={{ color: '#4b5563' }}>
              Please enter your details to create your account.
            </p>

            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                name="name"
                label={<span className="text-xs font-medium" style={{ color: '#4b5563' }}>Full Name</span>}
                rules={[{ required: true, message: 'Please enter your full name' }]}
                className="mb-2"
              >
                <Input
                  prefix={<User className="w-4 h-4 mr-2" style={{ color: '#9ca3af' }} />}
                  placeholder="Your name"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-xs font-medium" style={{ color: '#4b5563' }}>Email Address</span>}
                rules={[
                  { required: true, message: 'Please enter your work email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
                className="mb-2"
              >
                <Input
                  prefix={<Mail className="w-4 h-4 mr-2" style={{ color: '#9ca3af' }} />}
                  placeholder="name@company.com"
                />
              </Form.Item>

              <Form.Item
                name="contactNumber"
                label={<span className="text-xs font-medium" style={{ color: '#4b5563' }}>Contact Number</span>}
                rules={[{ required: true, message: 'Please enter your contact number' }]}
                className="mb-2"
              >
                <Input
                  prefix={<Phone className="w-4 h-4 mr-2" style={{ color: '#9ca3af' }} />}
                  placeholder="+91 98765 43210"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-xs font-medium" style={{ color: '#4b5563' }}>Password</span>}
                rules={[{ required: true, message: 'Please enter your password' }]}
                className="mb-3"
              >
                <Input.Password
                  prefix={<Lock className="w-4 h-4 mr-2" style={{ color: '#9ca3af' }} />}
                  placeholder="********"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={roleView === 'admin'}
                  className="w-full"
                  style={{
                    height: 36,
                    borderRadius: 5,
                    border: 'none',
                    boxShadow: 'none',
                    background: roleView === 'admin' ? '#9ca3af' : 'linear-gradient(90deg, #14c4f3, #00aeef)',
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </Form.Item>
            </Form>
          </div>

          {roleView === 'employee' ? (
            <p className="text-sm mt-3" style={{ color: '#6b7280' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold" style={{ color: '#0ea5e9' }}>
                Sign in
              </Link>
            </p>
          ) : (
            <p className="text-sm mt-3" style={{ color: '#6b7280' }}>
              Admin registration is disabled. Please go to Login page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
