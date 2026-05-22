import { useSelector } from 'react-redux';
import { useGetClaimsQuery } from '../store/apiSlice';
import { Card, Table, Tag, Statistic, Skeleton } from 'antd';
import { ArrowUpRight, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: claims, isLoading } = useGetClaimsQuery();

  const totalAmount = claims?.reduce((acc, claim) => acc + claim.totalAmount, 0) || 0;
  const pendingClaims = claims?.filter(c => c.status === 'PENDING').length || 0;
  const approvedClaims = claims?.filter(c => c.status === 'APPROVED' || c.status === 'PAID').length || 0;

  const columns = [
    { title: 'Viz No', dataIndex: 'vizNo', key: 'vizNo', className: 'font-medium text-gray-900' },
    { title: 'Date', dataIndex: 'expenseDate', key: 'date', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Amount', dataIndex: 'totalAmount', key: 'amount', render: (amount) => <span className="font-medium">${amount.toFixed(2)}</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'PENDING' ? 'warning' : status === 'APPROVED' ? 'processing' : status === 'PAID' ? 'success' : 'error';
        return <Tag color={color} className="rounded-full px-3">{status}</Tag>;
      },
    },
  ];

  if (userInfo?.role === 'ADMIN') {
    columns.splice(1, 0, { title: 'Employee', key: 'employee', render: (_, record) => record.user.name });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Good morning, {userInfo?.name?.split(' ')[0]}</h1>
          <p className="text-gray-500 mt-1 text-sm">Here's what's happening with your expenses today.</p>
        </div>
        {userInfo?.role !== 'ADMIN' && (
          <Link
            to="/claims/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            New Claim <ArrowUpRight className="ml-2 w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
          <Statistic
            title={<span className="flex items-center text-gray-500"><DollarSign className="w-4 h-4 mr-2" /> Total Processed</span>}
            value={totalAmount}
            precision={2}
            prefix="$"
            valueStyle={{ color: '#111827', fontWeight: 'bold' }}
          />
        </Card>
        <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
          <Statistic
            title={<span className="flex items-center text-gray-500"><Clock className="w-4 h-4 mr-2" /> Pending Claims</span>}
            value={pendingClaims}
            valueStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
          />
        </Card>
        <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
          <Statistic
            title={<span className="flex items-center text-gray-500"><CheckCircle className="w-4 h-4 mr-2" /> Approved</span>}
            value={approvedClaims}
            valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
          />
        </Card>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
        </div>
        {isLoading ? (
          <div className="p-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        ) : (
          <Table
            dataSource={claims?.slice(0, 5)}
            columns={columns}
            rowKey="id"
            pagination={false}
            className="custom-table"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
