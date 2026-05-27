import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, Select, message } from 'antd';
import { BriefcaseBusiness, Landmark } from 'lucide-react';
import FormSection from '../components/FormSection';
import PageHeader from '../components/PageHeader';
import { getAdminUsers, upsertAdminUser } from '../utils/adminUsersStorage';

const AdminUserForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const user = getAdminUsers().find((item) => String(item.id) === String(id));
      if (user) {
        form.setFieldsValue(user);
      } else {
        message.error('User not found');
        navigate('/users');
      }
    }
  }, [form, id, isEdit, navigate]);

  const handleSubmit = (values) => {
    upsertAdminUser({
      ...values,
      id: isEdit ? Number(id) : Date.now(),
    });
    message.success(isEdit ? 'User updated successfully' : 'User created successfully');
    navigate('/users');
  };

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit User' : 'Add New User'}
        subtitle="Fill out the form below to submit your business expense for new one"
        titleClassName="text-[#00aeef]"
      />

      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit} className="space-y-5">
        <FormSection icon={BriefcaseBusiness} title="Employee Information">
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-3">
            <Form.Item name="vizNo" label="VIZ No" rules={[{ required: true, message: 'Please enter VIZ number' }]}>
              <Input placeholder="VIZ-88291" />
            </Form.Item>
            <Form.Item name="name" label="Employee Name" rules={[{ required: true, message: 'Please enter employee name' }]}>
              <Input placeholder="Alex Sterling" />
            </Form.Item>
            {!isEdit && (
              <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}>
                <Input.Password placeholder="Enter a password" />
              </Form.Item>
            )}
            <Form.Item name="email" label="Email Address" rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Enter a valid email' }]}>
              <Input placeholder="alex.sterling@fintrack.corp" />
            </Form.Item>
            <Form.Item name="role" label="Role selection" rules={[{ required: true, message: 'Please select role' }]}>
              <Select
                placeholder="Select Category"
                options={[
                  { value: 'Full Stack Engineer', label: 'Full Stack Engineer' },
                  { value: 'Designer', label: 'Designer' },
                  { value: 'Admin', label: 'Admin' },
                ]}
              />
            </Form.Item>
            <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true, message: 'Please enter contact number' }]}>
              <Input placeholder="+1 (555) 000-0000" />
            </Form.Item>
          </div>
        </FormSection>

        <FormSection icon={Landmark} title="Bank Details">
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <Form.Item name="holderName" label="Account Holder Name">
              <Input placeholder="e.g. Client lunch at Grand Bistro" />
            </Form.Item>
            <Form.Item name="bank" label="Select Bank">
              <Select placeholder="Select Category" options={[{ value: 'Select Category', label: 'Select Category' }, { value: 'HDFC Bank', label: 'HDFC Bank' }, { value: 'ICICI Bank', label: 'ICICI Bank' }]} />
            </Form.Item>
            <Form.Item name="accountNumber" label="Account Number">
              <Input placeholder="0000000000" />
            </Form.Item>
            {!isEdit && (
              <Form.Item name="ifsc" label="IFSC Number">
                <Input placeholder="0000000000" />
              </Form.Item>
            )}
          </div>
        </FormSection>

        <div className="flex justify-end border-t border-[#d7e0e8] pt-4">
          <Button type="primary" htmlType="submit" className="h-9 rounded-md px-8 text-xs">
            {isEdit ? 'Update user' : 'Create user'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AdminUserForm;
