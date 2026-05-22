import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateClaimMutation } from '../store/apiSlice';
import { Form, Input, Button, DatePicker, Select, InputNumber, Upload, message, Card } from 'antd';
import { UploadCloud, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const NewClaim = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [createClaim, { isLoading }] = useCreateClaimMutation();
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    try {
      // Handle file upload separately or append to FormData if needed
      // For now we just send the JSON data
      await createClaim({
        ...values,
        expenseDate: values.expenseDate.toISOString(),
      }).unwrap();
      
      message.success('Claim submitted successfully!');
      navigate('/');
    } catch (err) {
      message.error(err?.data?.message || 'Failed to submit claim');
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create New Claim</h1>
          <p className="text-gray-500 mt-1 text-sm">Fill in the details for your reimbursement request.</p>
        </div>
      </div>

      <Card bordered={false} className="shadow-sm rounded-xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="category"
              label={<span className="text-gray-700 font-medium">Expense Category</span>}
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category" className="rounded-lg">
                <Option value="Travel">Travel & Transport</Option>
                <Option value="Meals">Meals & Entertainment</Option>
                <Option value="Equipment">Office Equipment</Option>
                <Option value="Software">Software & Subscriptions</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="expenseDate"
              label={<span className="text-gray-700 font-medium">Date of Expense</span>}
              rules={[{ required: true, message: 'Please select the date' }]}
            >
              <DatePicker className="w-full rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="purpose"
            label={<span className="text-gray-700 font-medium">Purpose of Expense</span>}
            rules={[{ required: true, message: 'Please enter the purpose' }]}
          >
            <Input placeholder="e.g., Client meeting in New York" className="rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Form.Item
              name="totalAmount"
              label={<span className="text-gray-700 font-medium">Total Amount</span>}
              rules={[{ required: true, message: 'Please enter the amount' }]}
            >
              <InputNumber
                prefix="$"
                className="w-full rounded-lg"
                min={0}
                precision={2}
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item
              name="amountSpentOn"
              label={<span className="text-gray-700 font-medium">Merchant / Vendor</span>}
            >
              <Input placeholder="e.g., Delta Airlines, Uber" className="rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="receipt"
            label={<span className="text-gray-700 font-medium">Upload Receipt</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload.Dragger
              name="file"
              multiple={false}
              beforeUpload={() => false}
              onChange={(info) => setFileList(info.fileList)}
              className="bg-gray-50 border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              <p className="ant-upload-drag-icon flex justify-center text-primary-500 mb-2">
                <UploadCloud className="w-8 h-8" />
              </p>
              <p className="ant-upload-text text-gray-700 font-medium">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint text-gray-500 text-sm">
                Support for a single PDF, JPG, or PNG upload.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            name="notes"
            label={<span className="text-gray-700 font-medium">Additional Notes</span>}
          >
            <TextArea rows={4} placeholder="Any extra information..." className="rounded-lg" />
          </Form.Item>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
            <Button
              size="large"
              onClick={() => navigate('/')}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              icon={<Send className="w-4 h-4 mr-2" />}
              className="rounded-lg px-8 flex items-center"
            >
              Submit Claim
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewClaim;
