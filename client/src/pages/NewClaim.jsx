import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, Input, Button, DatePicker, Select, InputNumber, Upload, message } from 'antd';
import { BadgeDollarSign, Briefcase, FileUp, Send, UserRound } from 'lucide-react';
import { useCreateClaimMutation, useUploadFileMutation } from '../store/apiSlice';
import FormSection from '../components/FormSection';
import PageHeader from '../components/PageHeader';

const { TextArea } = Input;

const NewClaim = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [createClaim, { isLoading: isCreating }] = useCreateClaimMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        name: userInfo.name || '',
        email: userInfo.email || '',
        vizId: userInfo.vizId || userInfo.vizNo || '',
        contact: userInfo.contactNumber || userInfo.contact || '',
      });
    }
  }, [form, userInfo]);

  const onFinish = async (values) => {
    try {
      let receiptUrl = '';

      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append('file', fileList[0].originFileObj);
        const res = await uploadFile(formData).unwrap();
        receiptUrl = res.url;
      }

      await createClaim({
        category: values.category,
        expenseDate: values.expenseDate.toISOString(),
        purpose: values.purpose,
        totalAmount: values.totalAmount,
        amountSpentOn: values.amountSpentOn,
        notes: values.notes,
        vizNo: values.vizId,
        personalDetails: {
          name: values.name,
          vizId: values.vizId,
          contact: values.contact,
          email: values.email,
        },
        contactNumber: values.contact,
        receiptUrl,
      }).unwrap();

      message.success('Request submitted successfully');
      navigate('/history');
    } catch (err) {
      message.error(err?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div>
      <PageHeader title="New Reimbursement Request" subtitle="Fill out the form below to submit your business expense for approval." />

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="space-y-5">
        <FormSection icon={UserRound} title="Employee Information">
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-3">
            <Form.Item name="vizId" label="Viz No" rules={[{ required: true, message: 'Please enter VIZ number' }]}>
              <Input placeholder="VIZ-82901" />
            </Form.Item>
            <Form.Item name="name" label="Employee Name" rules={[{ required: true, message: 'Please enter employee name' }]}>
              <Input placeholder="Alex Sterling" />
            </Form.Item>
            <Form.Item name="contact" label="Contact Number" rules={[{ required: true, message: 'Please enter contact number' }]}>
              <Input placeholder="+1 (555) 000-0000" />
            </Form.Item>
            <Form.Item name="email" label="Email Address" rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Enter a valid email' }]}>
              <Input placeholder="alex.sterling@fintrack.corp" />
            </Form.Item>
            <Form.Item name="expenseDate" label="Request Date" rules={[{ required: true, message: 'Please select request date' }]}>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
        </FormSection>

        <FormSection icon={BadgeDollarSign} title="Expense Details">
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <Form.Item name="category" label="Expense Category" rules={[{ required: true, message: 'Please select category' }]}>
              <Select
                placeholder="Select Category"
                options={[
                  { value: 'Meals', label: 'Meals' },
                  { value: 'Travel', label: 'Travel' },
                  { value: 'Software', label: 'Software' },
                  { value: 'Office Supplies', label: 'Office Supplies' },
                  { value: 'Transport', label: 'Transport' },
                  { value: 'Equipment', label: 'Equipment' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
            </Form.Item>
            <Form.Item name="purpose" label="Purpose of Expense" rules={[{ required: true, message: 'Please enter purpose' }]}>
              <Input placeholder="e.g. Client lunch at Grand Bistro" />
            </Form.Item>
            <Form.Item name="totalAmount" label="Total Amount (₹)" rules={[{ required: true, message: 'Please enter amount' }]}>
              <InputNumber min={0} precision={2} placeholder="₹ 0.00" className="w-full" />
            </Form.Item>
            <Form.Item name="amountSpentOn" label="Amount Spent On">
              <Input placeholder="Vendor or Merchant name" />
            </Form.Item>
          </div>
          <Form.Item name="notes" label="Additional Notes">
            <TextArea rows={4} placeholder="Provide any extra details or justifications..." />
          </Form.Item>
        </FormSection>

        <FormSection icon={Briefcase} title="Upload Bill / Invoice">
          <Upload.Dragger
            name="file"
            multiple={false}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={(info) => setFileList(info.fileList.slice(-1))}
            className="app-upload"
          >
            <div className="py-8 text-center">
              <FileUp className="mx-auto mb-3 h-8 w-8 text-[#172033]" />
              <p className="text-sm font-semibold text-[#172033]">Drag and drop files here</p>
              <p className="mt-1 text-xs text-[#64748b]">Support PDF, JPG, PNG. Max size 5MB per file</p>
              <Button type="primary" size="small" className="mt-4 h-8 rounded-full px-5 text-xs">
                Browse Files
              </Button>
            </div>
          </Upload.Dragger>
        </FormSection>

        <div className="flex justify-end border-t border-[#d7e0e8] pt-4">
          <Button type="primary" htmlType="submit" loading={isCreating || isUploading} icon={<Send className="h-4 w-4" />} className="h-9 rounded-md px-7 text-xs">
            Submit Request
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewClaim;
