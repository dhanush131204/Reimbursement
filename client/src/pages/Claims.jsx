import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetClaimsQuery, useDeleteClaimMutation } from '../store/apiSlice';
import { Table, Tag, Input, Skeleton, Button, Modal, message } from 'antd';
import { Search, Inbox, Plus, Filter, FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

const Claims = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: claims, isLoading } = useGetClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteClaim] = useDeleteClaimMutation();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState('');

  const handleViewReceipt = (record) => {
    if (record.receipts && record.receipts.length > 0) {
      setSelectedReceiptUrl(`http://localhost:5000${record.receipts[0].fileUrl}`);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReceiptUrl('');
  };

  const handleDeleteClaim = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this claim?',
      content: 'This action cannot be undone and will remove all associated data.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteClaim(id).unwrap();
          message.success('Claim deleted successfully');
        } catch {
          message.error('Failed to delete claim');
        }
      }
    });
  };

  const columns = [
    { title: 'Viz No', dataIndex: 'vizNo', key: 'vizNo', className: 'font-medium text-gray-900', render: (text) => <span className="text-primary-600 font-semibold">{text}</span> },
    { title: 'Date', dataIndex: 'expenseDate', key: 'date', render: (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <span className="text-gray-600">{cat}</span> },
    { title: 'Purpose', dataIndex: 'purpose', key: 'purpose', render: (purpose) => <span className="text-gray-700 max-w-xs truncate block" title={purpose}>{purpose}</span> },
    { title: 'Amount', dataIndex: 'totalAmount', key: 'amount', render: (amount) => <span className="font-bold text-gray-900">{formatCurrency(amount)}</span> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'PENDING' ? 'warning' : status === 'APPROVED' ? 'processing' : status === 'PAID' ? 'success' : 'error';
        return <Tag color={color} className="rounded-full px-3 py-0.5 border-0 font-medium tracking-wide shadow-sm">{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex items-center gap-4">
          {record.receipts && record.receipts.length > 0 ? (
            <Button 
              type="link" 
              icon={<FileText className="w-4 h-4 mr-1 inline" />} 
              onClick={() => handleViewReceipt(record)}
              className="text-primary-600 hover:text-primary-700 font-medium px-0"
            >
              View Bill
            </Button>
          ) : (
            <span className="text-gray-400 text-sm">No Bill</span>
          )}
          {userInfo?.role === 'ADMIN' && (
            <Button
              type="text"
              danger
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => handleDeleteClaim(record.id)}
              className="px-2"
              title="Delete Claim"
            />
          )}
        </div>
      )
    }
  ];

  if (userInfo?.role === 'ADMIN') {
    columns.splice(1, 0, {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold mr-2">
            {record.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="leading-tight">
            <p className="font-medium text-gray-700">{record.user?.name || 'Unknown User'}</p>
            <p className="text-xs text-gray-500">{record.user?.contactNumber || 'No contact number'}</p>
          </div>
        </div>
      )
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Claims History</h1>
          <p className="text-gray-500 mt-2 text-base">
            {userInfo?.role === 'ADMIN' ? 'Manage and review all company expense claims.' : 'View, track, and manage all your submitted claims.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Input 
            size="large" 
            placeholder="Search claims..." 
            prefix={<Search className="w-4 h-4 text-gray-400 mr-2" />} 
            className="rounded-xl shadow-sm w-full sm:w-64 border-gray-200"
          />
          <Button size="large" icon={<Filter className="w-4 h-4" />} className="rounded-xl w-full sm:w-auto">
            Filters
          </Button>
          {userInfo?.role !== 'ADMIN' && (
            <Button type="primary" size="large" icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/claims/new')} className="rounded-xl w-full sm:w-auto shadow-glow">
              New Claim
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden mt-8">
        {isLoading ? (
          <div className="p-8">
            <Skeleton active paragraph={{ rows: 8 }} title={false} />
          </div>
        ) : claims && claims.length > 0 ? (
          <Table
            dataSource={claims}
            columns={columns}
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              className: 'px-6 py-4 border-t border-gray-100',
              showSizeChanger: false
            }}
            className="custom-table"
          />
        ) : (
          <div className="py-20 px-6 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-50 mb-6 relative">
              <Inbox className="w-12 h-12 text-primary-400 absolute" />
              <div className="absolute top-0 right-0 w-5 h-5 bg-primary-200 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No claims found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
              {userInfo?.role === 'ADMIN' 
                ? "There are no claims to review at the moment." 
                : "You haven't submitted any claims yet or none match your search."}
            </p>
            {userInfo?.role !== 'ADMIN' && (
              <Button type="primary" size="large" onClick={() => navigate('/claims/new')} icon={<Plus className="w-5 h-5" />} className="h-12 px-6 rounded-xl font-semibold shadow-glow">
                Submit a Claim
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        title="View Bill/Receipt"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
        width={800}
        destroyOnClose
      >
        {selectedReceiptUrl && (
          <div className="flex justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            {selectedReceiptUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe 
                src={selectedReceiptUrl} 
                className="w-full h-[600px] rounded-lg shadow-sm" 
                title="Receipt PDF" 
              />
            ) : (
              <img 
                src={selectedReceiptUrl} 
                alt="Receipt" 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm" 
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Claims;
