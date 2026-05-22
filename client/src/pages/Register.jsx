import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../store/apiSlice';
import { setCredentials } from '../store/authSlice';
import { Form, Input, Button, message } from 'antd';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerApi] = useRegisterMutation();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await registerApi({ 
        name: values.name, 
        email: values.email, 
        password: values.password 
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
    <div className="min-h-screen w-full flex font-sans overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      
      {/* LEFT SIDE: Premium Visuals */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16"
        style={{ background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 40%, #5b21b6 100%)' }}
      >
        {/* Abstract Floating Shapes */}
        <div
          className="absolute rounded-full"
          style={{
            top: '-10%', left: '-10%', width: 500, height: 500,
            background: 'rgba(139, 92, 246, 0.3)',
            filter: 'blur(120px)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '-20%', right: '-10%', width: 600, height: 600,
            background: 'rgba(147, 197, 253, 0.2)',
            filter: 'blur(130px)',
            animation: 'pulse 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: '40%', left: '60%', width: 300, height: 300,
            background: 'rgba(16, 185, 129, 0.15)',
            filter: 'blur(90px)',
          }}
        />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #fff, #f1f5f9)' }}
          >
            <div className="w-4 h-4 rounded-sm rotate-45" style={{ backgroundColor: '#7c3aed' }} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Expensify.</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-lg mb-20 animate-fade-in-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span className="flex h-2 w-2 relative">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: '#10b981', animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#10b981' }} />
            </span>
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Join us today
            </span>
          </div>
          
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Start managing <br/>
            <span
              className="bg-clip-text"
              style={{
                color: 'transparent',
                backgroundImage: 'linear-gradient(90deg, #ddd6fe, #93c5fd)',
              }}
            >
              your expenses
            </span>
          </h1>
          <p className="text-lg leading-relaxed font-light max-w-md" style={{ color: 'rgba(221, 214, 254, 0.8)' }}>
            Register your account to experience the most powerful and beautifully designed platform for managing employee reimbursements.
          </p>
        </div>

        {/* Footer Trust */}
        <div className="relative z-10 flex items-center gap-6 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <span>Trusted by modern teams</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent)' }} />
        </div>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative" style={{ backgroundColor: '#f8fafc' }}>
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
          >
            <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: '#111827' }}>Expensify.</span>
        </div>

        <div
          className="w-full max-w-md bg-white p-10 relative z-10 animate-fade-in-up"
          style={{
            borderRadius: '2rem',
            boxShadow: '0 8px 40px rgba(0,0,0,0.04)',
            border: '1px solid #f1f5f9',
          }}
        >
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: '#111827' }}>Create an account</h2>
            <p className="font-medium" style={{ color: '#6b7280' }}>Please enter your details to register.</p>
          </div>

          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="name"
              label={<span className="font-semibold text-sm" style={{ color: '#374151' }}>Full Name</span>}
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input
                prefix={<User className="w-5 h-5 mr-2" style={{ color: '#9ca3af' }} />}
                placeholder="Olivia Rhye"
                style={{ height: 56, borderRadius: 12, fontSize: 16 }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="font-semibold text-sm" style={{ color: '#374151' }}>Work Email</span>}
              rules={[
                { required: true, message: 'Please enter your work email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<Mail className="w-5 h-5 mr-2" style={{ color: '#9ca3af' }} />}
                placeholder="olivia@company.com"
                style={{ height: 56, borderRadius: 12, fontSize: 16 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="font-semibold text-sm" style={{ color: '#374151' }}>Password</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<Lock className="w-5 h-5 mr-2" style={{ color: '#9ca3af' }} />}
                placeholder="••••••••"
                style={{ height: 56, borderRadius: 12, fontSize: 16 }}
              />
            </Form.Item>

            <Form.Item className="pt-4 mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full"
                style={{
                  height: 56,
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {!loading && (
                  <span className="flex items-center justify-center gap-2">
                    Create account <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium" style={{ color: '#6b7280' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold"
                style={{ color: '#7c3aed' }}
                onMouseEnter={(e) => (e.target.style.color = '#6d28d9')}
                onMouseLeave={(e) => (e.target.style.color = '#7c3aed')}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
