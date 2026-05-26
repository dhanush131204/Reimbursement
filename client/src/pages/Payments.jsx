import { Table, Tag, Button } from 'antd';
import { CreditCard, Download, ExternalLink, Activity } from 'lucide-react';

const Payments = () => {
  // In a real app, this would be fetched from the API.
  // We mock some data for the empty state or placeholder state.
  const payments = []; // Set to empty to show the premium empty state

  const columns = [
    { title: 'Payment ID', dataIndex: 'id', key: 'id', className: 'font-medium text-gray-900' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => <span className="font-bold text-gray-900">${amount.toFixed(2)}</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'COMPLETED' ? 'success' : status === 'PROCESSING' ? 'processing' : 'warning';
        return <Tag color={color} className="rounded-full px-3 py-0.5 border-0 font-medium tracking-wide shadow-sm">{status}</Tag>;
      },
    },
    {
      title: 'Receipt',
      key: 'receipt',
      render: () => <Button type="text" icon={<Download className="w-4 h-4 text-primary-600" />} />
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payments</h1>
          <p className="text-gray-500 mt-2 text-base">Track your reimbursements and payment history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-900 to-primary-700 rounded-2xl p-8 shadow-glow text-white relative overflow-hidden group hover:shadow-glow-hover transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity">
            <CreditCard className="w-24 h-24 transform rotate-12" />
          </div>
          <p className="text-primary-100 font-medium mb-1 relative z-10">Total Received</p>
          <h2 className="text-4xl font-bold mb-4 relative z-10">$0.00</h2>
          <div className="flex items-center text-sm font-medium text-primary-100 relative z-10">
            <Activity className="w-4 h-4 mr-2" /> No payments processed yet
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
          <p className="text-gray-500 font-medium mb-1 relative z-10">Next Scheduled Payment</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative z-10">--</h2>
          <div className="flex items-center text-sm font-medium text-gray-400 relative z-10">
            <ExternalLink className="w-4 h-4 mr-2" /> Pending finance approval
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
        </div>
        
        {payments.length > 0 ? (
          <Table
            dataSource={payments}
            columns={columns}
            rowKey="id"
            pagination={false}
            className="custom-table"
          />
        ) : (
          <div className="py-20 px-6 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-50 mb-6 relative">
              <CreditCard className="w-12 h-12 text-primary-400 absolute" />
              <div className="absolute top-0 right-0 w-5 h-5 bg-primary-200 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No payments yet</h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg">
              You don't have any payment history. Once your claims are approved and processed, the transactions will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
