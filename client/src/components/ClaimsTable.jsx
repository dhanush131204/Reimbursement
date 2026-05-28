import { Button, Input, Modal, Table, message } from 'antd';
import { useState } from 'react';
import { Car, Eye, Laptop, Plane, ShoppingBag, Utensils, Package } from 'lucide-react';
import { useUpdateClaimStatusMutation } from '../store/apiSlice';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '../utils/currency';

const categoryIcons = {
  Meals: Utensils,
  Travel: Plane,
  Software: Laptop,
  'Office Supplies': ShoppingBag,
  Transport: Car,
  Equipment: Package,
  Other: Package,
};

const formatDate = (date) => {
  if (!date) return '--';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const ClaimsTable = ({ claims = [], loading, showEmployee = false, pagination = true, title = 'Requests', compactHeader = false, adminActions = false }) => {
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [updateClaimStatus, { isLoading: isUpdating }] = useUpdateClaimStatusMutation();

  const handleView = (record) => {
    const fileUrl = record.receipts?.[0]?.fileUrl || record.receiptUrl;
    setSelectedClaim(record);
    if (fileUrl) {
      setSelectedReceiptUrl(fileUrl.startsWith('http') ? fileUrl : `http://localhost:5000${fileUrl}`);
    }
  };

  const handleClose = () => {
    setSelectedReceiptUrl('');
    setSelectedClaim(null);
  };

  const handleStatusChange = async (status, payload = {}) => {
    try {
      await updateClaimStatus({ id: selectedClaim.id, status, ...payload }).unwrap();
      message.success(`Request ${status.toLowerCase()} successfully`);
      setRejectionReason('');
      setIsRejectModalOpen(false);
      handleClose();
    } catch (err) {
      message.error(err?.data?.message || 'Failed to update request');
    }
  };

  const openRejectModal = () => {
    // when opening, prefill any existing rejection reason so admin can edit
    setRejectionReason(selectedClaim?.rejectionReason || '');
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectionReason('');
  };



  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'vizNo',
      key: 'vizNo',
      render: (value) => <span className="font-semibold text-[#172033]">{value || '#FT-8288'}</span>,
    },
    ...(showEmployee
      ? [
          {
            title: 'Employee',
            key: 'employee',
            render: (_, record) => (
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--app-primary-soft)] text-xs font-semibold text-[var(--app-primary)]">
                  {(record.user?.name || 'U').charAt(0)}
                </span>
                <span className="font-medium text-[#334155]">{record.user?.name || 'Unknown'}</span>
              </div>
            ),
          },
        ]
      : []),
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (value) => {
        const Icon = categoryIcons[value] || Package;
        return (
          <span className="inline-flex items-center gap-1.5 text-[#344054]">
            <Icon className="h-3.5 w-3.5 text-[var(--app-primary)]" />
            {value || 'Other'}
          </span>
        );
      },
    },
    { title: 'Date', dataIndex: 'expenseDate', key: 'date', render: formatDate },
    { title: 'Amount', dataIndex: 'totalAmount', key: 'amount', render: (amount) => <span className="font-semibold text-[#111827]">{formatCurrency(amount)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <StatusBadge status={status} /> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        adminActions ? (
          <button type="button" aria-label="View" className="text-[#006bd6]" onClick={() => handleView(record)}>
            <Eye className="h-4 w-4" />
          </button>
        ) : (
          <Button size="small" icon={<Eye className="h-3.5 w-3.5" />} className="h-8 rounded-md border-[#d7e0e8] px-3 text-xs text-[#172033]" onClick={() => handleView(record)}>
            View
          </Button>
        )
      ),
    },
  ];

  return (
    <>
      <div className={`w-full overflow-hidden bg-white ${compactHeader ? '' : 'rounded-lg border border-[#d7e0e8]'}`}>
        {!compactHeader && (
          <div className="flex flex-col gap-2 px-5 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#172033]">{title}</h2>
              <p className="text-xs text-[#64748b]">Review invoice details, status, and supporting documents.</p>
            </div>
            <div className="rounded-full bg-[#f3f6fa] px-3 py-1 text-xs font-semibold text-[#475467]">
              {claims.length} {claims.length === 1 ? 'record' : 'records'}
            </div>
          </div>
        )}
        <div className="max-w-full overflow-hidden">
          <Table
            dataSource={claims}
            columns={columns}
            rowKey="id"
            loading={loading}
            tableLayout="fixed"
            pagination={
              pagination
                ? {
                    pageSize: 5,
                    showSizeChanger: false,
                    size: 'small',
                    className: 'app-pagination px-4 py-3',
                  }
                : false
            }
            className="app-table"
            locale={{
              emptyText: (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f6fa]">
                    <Package className="h-5 w-5 text-[#64748b]" />
                  </div>
                  <p className="text-sm font-semibold text-[#172033]">No requests found</p>
                  <p className="text-xs text-[#64748b]">Try clearing filters or checking another status page.</p>
                </div>
              ),
            }}
          />
        </div>
      </div>

      <Modal
        title="View Bill / Invoice"
        open={Boolean(selectedClaim)}
        onCancel={handleClose}
        footer={
          showEmployee && selectedClaim?.status === 'PENDING'
            ? [
                <Button key="reject" danger loading={isUpdating} onClick={openRejectModal}>
                  Reject
                </Button>,
                <Button key="approve" type="primary" loading={isUpdating} onClick={() => handleStatusChange('APPROVED')}>
                  Approve
                </Button>,
              ]
            : null
        }
        width={860}
      >
        {!selectedReceiptUrl ? (
          <p className="text-sm text-[#64748b]">No bill or invoice was uploaded for this request.</p>
        ) : selectedReceiptUrl.toLowerCase().endsWith('.pdf') ? (
          <iframe src={selectedReceiptUrl} className="h-[80vh] w-full rounded-md border border-[#d7e0e8]" title="Receipt PDF" />
        ) : (
          <div className="flex justify-center">
            <img src={selectedReceiptUrl} alt="Receipt" className="block max-h-[80vh] w-full rounded-md object-contain" />
          </div>
        )}
      </Modal>

      <Modal
        title="Reject Request"
        open={isRejectModalOpen}
        onCancel={closeRejectModal}
        onOk={() => handleStatusChange('REJECTED', { rejectionReason })}
        okText="Reject"
        okButtonProps={{ danger: true, loading: isUpdating, disabled: !rejectionReason.trim() }}
        width={560}
      >
        <p className="text-sm text-[#475467] mb-3">Enter the reason for rejecting this request.</p>
        <Input.TextArea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={4}
          placeholder="Type rejection reason here"
        />
      </Modal>
    </>
  );
};

export default ClaimsTable;
