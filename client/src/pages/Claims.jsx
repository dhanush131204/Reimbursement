import { useSelector } from 'react-redux';
import { useGetClaimsQuery } from '../store/apiSlice';
import { Card, Table, Tag, Input, Skeleton } from 'antd';
import { Search } from 'lucide-react';

const Claims = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: claims, isLoading } = useGetClaimsQuery();

  const columns = [
    { title: 'Viz No', dataIndex: 'vizNo', key: 'vizNo', className: 'font-medium text-gray-900' },
    { title: 'Date', dataIndex: 'expenseDate', key: 'date', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Purpose', dataIndex: 'purpose', key: 'purpose' },
    { title: 'Amount', dataIndex: 'totalAmount', key: 'amount', render: (amount) => <span className="font-medium">${amount.toFixed(2)}</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'PENDING' ? 'warning' : status === 'APPROVED' ? 'processing' : status === 'PAID' ? 'success' : 'error';
        return <Tag color={color} className="rounded-full px-3 py-0.5">{status}</Tag>;
      },
    },
  ];

  if (userInfo?.role === 'ADMIN') {
    columns.splice(1, 0, { title: 'Employee', key: 'employee', render: (_, record) => record.user.name });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Claims History</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {userInfo?.role === 'ADMIN' ? 'Manage all company expense claims.' : 'View and track all your submitted claims.'}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Input 
            size="large" 
            placeholder="Search claims..." 
            prefix={<Search className="w-4 h-4 text-gray-400 mr-2" />} 
            className="rounded-lg shadow-sm"
          />
        </div>
      </div>

      <Card bordered={false} className="shadow-sm rounded-xl p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : (
          <Table
            dataSource={claims}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="custom-table"
          />
        )}
      </Card>
    </div>
  );
};

export default Claims;
