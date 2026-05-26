import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Palette, UserRound, BellRing } from 'lucide-react';
import { Button, Form, Input, Switch, message } from 'antd';
import PageHeader from '../components/PageHeader';
import { useUpdateProfileMutation } from '../store/apiSlice';
import { setCredentials } from '../store/authSlice';

const colors = ['#19c6ef', '#009fbd', '#9d3b2d', '#1155c9', '#4b47b5', '#151922'];
const themeStorageKey = 'appTheme';

const applyTheme = ({ accentColor, mode }) => {
  const root = document.documentElement;
  root.style.setProperty('--app-primary', accentColor);
  root.style.setProperty('--app-primary-dark', accentColor);
  root.style.setProperty('--app-primary-soft', `${accentColor}22`);
  root.dataset.theme = mode;
};

const Settings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(themeStorageKey);
    return savedTheme ? JSON.parse(savedTheme) : { accentColor: colors[0], mode: 'light' };
  });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const name = userInfo?.name || 'Santhosh';
  const accountRoleLabel = userInfo?.role === 'ADMIN' ? 'Admin' : 'Employee';
  const designation = userInfo?.designation || accountRoleLabel;

  useEffect(() => {
    form.setFieldsValue({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      contactNumber: userInfo?.contactNumber || '',
      vizNo: userInfo?.vizNo || '',
      designation: userInfo?.designation || '',
    });
  }, [form, userInfo]);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(themeStorageKey, JSON.stringify(theme));
  }, [theme]);

  const handleCancel = () => {
    form.setFieldsValue({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      contactNumber: userInfo?.contactNumber || '',
      vizNo: userInfo?.vizNo || '',
      designation: userInfo?.designation || '',
    });
    setIsEditing(false);
  };

  const handleSave = async (values) => {
    try {
      const updatedUser = await updateProfile(values).unwrap();
      dispatch(setCredentials(updatedUser));
      message.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      message.error(err?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile, account status, and app preferences." />

      <div className="mb-5 overflow-hidden rounded-lg border border-[#d7e0e8] bg-white">
        <div className="h-28" style={{ background: 'linear-gradient(90deg, var(--app-primary), var(--app-primary-dark))' }} />
        <div className="-mt-10 flex items-end gap-4 px-6 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border-4 border-white bg-[var(--app-primary-soft)] text-3xl font-semibold text-[var(--app-primary)] shadow-sm">
            {name.charAt(0)}
          </div>
          <div className="pb-2">
            <h2 className="text-2xl font-semibold text-[#111827]">{name}</h2>
            <p className="text-sm text-[#64748b]">{designation}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="rounded-lg border border-[#d7e0e8] bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#edf2f7] pb-3">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-[var(--app-primary)]" />
                <h3 className="text-sm font-semibold text-[#172033]">Personal Information</h3>
              </div>
              {!isEditing && (
                <Button type="primary" size="small" onClick={() => setIsEditing(true)} className="h-8 rounded-md px-4 text-xs">
                  Edit Profile
                </Button>
              )}
            </div>
            {isEditing ? (
              <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
                <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2">
                  <Form.Item
                    name="name"
                    label={<span className="text-xs font-medium text-[#64748b]">Full Name</span>}
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input className="h-9 rounded-md" />
                  </Form.Item>
                  <Form.Item name="vizNo" label={<span className="text-xs font-medium text-[#64748b]">VIZ No</span>}>
                    <Input className="h-9 rounded-md" placeholder="Enter VIZ number" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label={<span className="text-xs font-medium text-[#64748b]">Email Address</span>}
                    rules={[
                      { required: true, message: 'Please enter your email address' },
                      { type: 'email', message: 'Please enter a valid email address' },
                    ]}
                  >
                    <Input className="h-9 rounded-md" />
                  </Form.Item>
                  <Form.Item name="contactNumber" label={<span className="text-xs font-medium text-[#64748b]">Mobile Number</span>}>
                    <Input className="h-9 rounded-md" />
                  </Form.Item>
                  <Form.Item name="designation" label={<span className="text-xs font-medium text-[#64748b]">Job Role / Designation</span>}>
                    <Input className="h-9 rounded-md" placeholder="Designer, Developer, Finance, etc." />
                  </Form.Item>
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleCancel} className="h-8 rounded-md px-4 text-xs">
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={isLoading} className="h-8 rounded-md px-4 text-xs">
                    Save Changes
                  </Button>
                </div>
              </Form>
            ) : (
              <div className="grid grid-cols-1 gap-y-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-xs text-[#64748b]">Full Name</p>
                  <p className="font-semibold text-[#172033]">{name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">VIZ No</p>
                  <p className="font-semibold text-[#172033]">{userInfo?.vizNo || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Email Address</p>
                  <p className="font-semibold text-[#172033]">{userInfo?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Mobile Number</p>
                  <p className="font-semibold text-[#172033]">{userInfo?.contactNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748b]">Job Role / Designation</p>
                  <p className="font-semibold text-[#172033]">{designation}</p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-lg border border-[#d7e0e8] bg-white p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-[#edf2f7] pb-3">
              <Palette className="h-4 w-4 text-[var(--app-primary)]" />
              <h3 className="text-sm font-semibold text-[#172033]">Theme Customization</h3>
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#64748b]">Primary Accent Color</p>
            <div className="mb-5 flex gap-3">
              {colors.map((color, index) => (
                <button
                  type="button"
                  key={color}
                  aria-label={`Use accent color ${index + 1}`}
                  onClick={() => setTheme((currentTheme) => ({ ...currentTheme, accentColor: color }))}
                  className={`h-9 w-9 rounded-full ${theme.accentColor === color ? 'ring-2 ring-[var(--app-primary)] ring-offset-2' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#64748b]">Appearance Mode</p>
            <div className="inline-flex rounded-lg border border-[#d7e0e8] bg-[#f8fbfd] p-1">
              <button
                type="button"
                onClick={() => setTheme((currentTheme) => ({ ...currentTheme, mode: 'light' }))}
                className={`rounded-md px-8 py-2 text-xs font-semibold ${
                  theme.mode === 'light' ? 'bg-white text-[#172033] shadow-sm' : 'text-[#64748b]'
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme((currentTheme) => ({ ...currentTheme, mode: 'dark' }))}
                className={`rounded-md px-8 py-2 text-xs font-semibold ${
                  theme.mode === 'dark' ? 'bg-[#172033] text-white shadow-sm' : 'text-[#64748b]'
                }`}
              >
                Dark
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-[#d7e0e8] bg-white p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[#edf2f7] pb-3">
              <h3 className="text-sm font-semibold text-[#172033]">Account Status</h3>
              <CheckCircle className="h-5 w-5 text-[#0b9f5a]" />
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#dff8ec] px-3 py-1 text-xs font-semibold text-[#0b9f5a]">
              <span className="h-2 w-2 rounded-full bg-current" />
              Active
            </div>
            <p className="text-xs leading-5 text-[#64748b]">
              Your {accountRoleLabel.toLowerCase()} account is active and ready to use.
            </p>
          </section>

          <section className="rounded-lg border border-[#d7e0e8] bg-white p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-[#edf2f7] pb-3">
              <BellRing className="h-4 w-4 text-[var(--app-primary)]" />
              <h3 className="text-sm font-semibold text-[#172033]">Notifications</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#172033]">Email Summaries</p>
                <p className="text-xs text-[#64748b]">Weekly expense reports</p>
              </div>
              <Switch defaultChecked size="small" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
