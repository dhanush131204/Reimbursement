import { useCallback, useMemo, useState } from 'react';
import { Button, Checkbox, Modal, Select, Table, message } from 'antd';
import { CalendarDays, Car, Eye, Laptop, Plane, ShoppingBag, Trash2 } from 'lucide-react';
import { useCreateRazorpayOrderMutation, useDeleteClaimMutation, useGetClaimsQuery, useVerifyRazorpayPaymentMutation } from '../store/apiSlice';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency } from '../utils/currency';

const icons = {
  Travel: Plane,
  Software: Laptop,
  'Office Supplies': ShoppingBag,
  Transport: Car,
};

const defaultFilters = {
  dateRange: 'Last 30 Days',
  category: 'All Categories',
  status: 'All Statuses',
};

const dateRangeOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Month', 'This Year'];
const categoryOptions = ['All Categories', 'Meals', 'Travel', 'Software', 'Office Supplies', 'Transport', 'Equipment', 'Other'];
const statusOptions = ['Selected status', 'APPROVED', 'PENDING', 'PAID'];

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout'));
    document.body.appendChild(script);
  });

const Payments = () => {
  const { data: claims = [], isLoading } = useGetClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimToDelete, setClaimToDelete] = useState(null);
  const [deletedRowKeys, setDeletedRowKeys] = useState([]);
  const [paidRowKeys, setPaidRowKeys] = useState([]);
  const [deleteClaim, { isLoading: isDeleting }] = useDeleteClaimMutation();
  const [createRazorpayOrder, { isLoading: isCreatingOrder }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment, { isLoading: isVerifyingPayment }] = useVerifyRazorpayPaymentMutation();
  const baseRows = useMemo(() => {
    return claims
      .filter((claim) => ['APPROVED', 'PAID', 'PENDING'].includes(claim.status))
      .filter((claim) => !deletedRowKeys.includes(claim.id))
      .map((claim) => (paidRowKeys.includes(claim.id) ? { ...claim, status: 'PAID' } : claim));
  }, [claims, deletedRowKeys, paidRowKeys]);
  const rows = useMemo(() => {
    const filteredRows = baseRows.filter((row) => {
      const categoryMatches = appliedFilters.category === 'All Categories' || row.category === appliedFilters.category;
      const statusMatches = appliedFilters.status === 'All Statuses' || row.status === appliedFilters.status;
      return categoryMatches && statusMatches;
    });

    return filteredRows.slice(0, 5);
  }, [appliedFilters, baseRows]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const deleteRow = useCallback(
    async () => {
      if (!claimToDelete) return;

      try {
        await deleteClaim(claimToDelete.id).unwrap();

        setDeletedRowKeys((current) => [...current, claimToDelete.id]);
        setSelectedRowKeys((current) => current.filter((key) => key !== claimToDelete.id));
        setClaimToDelete(null);
        message.success('Request deleted successfully');
      } catch (error) {
        message.error(error?.data?.message || 'Failed to delete request');
      }
    },
    [claimToDelete, deleteClaim],
  );

  const paySelectedRows = async () => {
    const selectedRows = rows.filter((row) => selectedRowKeys.includes(row.id));
    const payableRows = selectedRows.filter((row) => row.status === 'APPROVED');

    if (!selectedRows.length) {
      message.warning('Please select at least one request to pay');
      return;
    }

    if (payableRows.length !== selectedRows.length) {
      message.warning('Only approved unpaid requests can be paid through Razorpay');
      return;
    }

    try {
      await loadRazorpayCheckout();

      const order = await createRazorpayOrder(payableRows.map((row) => row.id)).unwrap();

      const paymentResponse = await new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: order.name,
          description: order.description,
          order_id: order.orderId,
          handler: resolve,
          modal: {
            ondismiss: () => reject(new Error('Payment was cancelled')),
          },
          prefill: {
            name: payableRows[0]?.user?.name || '',
            email: payableRows[0]?.user?.email || '',
            contact: payableRows[0]?.user?.contactNumber || '',
          },
          theme: {
            color: '#0f5bd7',
          },
        });

        razorpay.open();
      });

      await verifyRazorpayPayment({
        claimIds: order.claimIds,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      }).unwrap();

      setPaidRowKeys((current) => Array.from(new Set([...current, ...payableRows.map((row) => row.id)])));
      setSelectedRowKeys([]);
      message.success('Razorpay payment successful');
    } catch (error) {
      message.error(error?.data?.message || error?.message || 'Failed to process Razorpay payment');
    }
  };

  const cancelSelection = () => {
    setSelectedRowKeys([]);
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <Checkbox
            checked={rows.length > 0 && selectedRowKeys.length === rows.length}
            indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < rows.length}
            onChange={(event) => setSelectedRowKeys(event.target.checked ? rows.map((row) => row.id) : [])}
          />
        ),
        dataIndex: 'select',
        width: 70,
        render: (_, record) => <Checkbox checked={selectedRowKeys.includes(record.id)} onChange={(event) => setSelectedRowKeys((current) => (event.target.checked ? [...current, record.id] : current.filter((key) => key !== record.id)))} />,
      },
      { title: 'Request ID', dataIndex: 'vizNo', key: 'vizNo', render: (value) => <span className="font-semibold text-[#172033]">{value || '-'}</span> },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (value) => {
          const Icon = icons[value] || ShoppingBag;
          return (
            <span className="inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-[#006bd6]" />
              {value}
            </span>
          );
        },
      },
      { title: 'Date', dataIndex: 'expenseDate', key: 'expenseDate', render: formatDate },
      { title: 'Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount) => <span className="font-semibold text-[#172033]">{formatCurrency(amount)}</span> },
      { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <StatusBadge status={status} /> },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className="flex items-center gap-5">
            <button type="button" aria-label="View request" onClick={() => setSelectedClaim(record)} className="cursor-pointer text-[#006bd6]">
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Delete request"
              onClick={() => setClaimToDelete(record)}
              disabled={isDeleting}
              className="cursor-pointer text-[#ff2f3f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [isDeleting, rows, selectedRowKeys],
  );

  const selectedReceiptUrl = selectedClaim?.receipts?.[0]?.fileUrl || selectedClaim?.receiptUrl || '';
  const receiptUrl = selectedReceiptUrl && (selectedReceiptUrl.startsWith('http') ? selectedReceiptUrl : `http://localhost:5000${selectedReceiptUrl}`);

  return (
    <>
      <div className="space-y-5">
        <PageHeader title="Payment Processing" subtitle="Select approved claims to process bulk payments." />

        <div className="rounded-lg border border-[#cbd7e1] bg-white p-4">
          <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[1fr_1fr_1fr_110px_120px]">
            <label className="block text-[11px] font-semibold text-[#344054]">
              Date Range
              <Select
                value={filters.dateRange}
                onChange={(value) => setFilters((current) => ({ ...current, dateRange: value }))}
                className="mt-1 w-full"
                options={dateRangeOptions.map((value) => ({
                  value,
                  label: (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {value}
                    </span>
                  ),
                }))}
              />
            </label>
            <label className="block text-[11px] font-semibold text-[#344054]">
              Category
              <Select
                value={filters.category}
                onChange={(value) => setFilters((current) => ({ ...current, category: value }))}
                className="mt-1 w-full"
                options={categoryOptions.map((value) => ({ value, label: value }))}
              />
            </label>
            <label className="block text-[11px] font-semibold text-[#344054]">
              Status
              <Select
                value={filters.status}
                onChange={(value) => setFilters((current) => ({ ...current, status: value }))}
                className="mt-1 w-full"
                options={statusOptions.map((value) => ({ value, label: value }))}
              />
            </label>
            <Button className="h-9 rounded-md" onClick={resetFilters}>Reset</Button>
            <Button type="primary" className="h-9 rounded-md" onClick={() => setAppliedFilters(filters)}>Apply</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#cbd7e1] bg-white">
          <Table
            dataSource={rows}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            tableLayout="fixed"
            className="app-table"
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
              size: 'small',
              className: 'app-pagination px-4 py-3',
              showTotal: (total, range) => total > 0 ? `Showing ${range[0]} of ${total} requests` : 'Showing 0 of 0 requests',
            }}
          />
        </div>

        <div className="pt-20">
          <div className="grid grid-cols-1 gap-5 rounded-xl bg-white p-4 shadow-[0_3px_16px_rgba(15,23,42,0.12)] md:grid-cols-[1fr_1.25fr]">
            <Button className="h-12 rounded-lg border-0 bg-[#f5f5f5] text-base" onClick={cancelSelection}>
              Cancel
            </Button>
            <Button type="primary" className="h-12 rounded-lg text-base" loading={isCreatingOrder || isVerifyingPayment} onClick={paySelectedRows}>
              Pay now
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Payment Request Details"
        open={Boolean(selectedClaim)}
        onCancel={() => setSelectedClaim(null)}
        footer={null}
        width={720}
      >
        {selectedClaim && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <p><span className="font-semibold text-[#172033]">Request ID:</span> {selectedClaim.vizNo || '-'}</p>
              <p><span className="font-semibold text-[#172033]">Employee:</span> {selectedClaim.user?.name || 'Unknown'}</p>
              <p><span className="font-semibold text-[#172033]">Category:</span> {selectedClaim.category || '-'}</p>
              <p><span className="font-semibold text-[#172033]">Date:</span> {formatDate(selectedClaim.expenseDate)}</p>
              <p><span className="font-semibold text-[#172033]">Amount:</span> {formatCurrency(selectedClaim.totalAmount)}</p>
              <p><span className="font-semibold text-[#172033]">Status:</span> <StatusBadge status={selectedClaim.status} /></p>
              <p className="md:col-span-2"><span className="font-semibold text-[#172033]">Purpose:</span> {selectedClaim.purpose || '-'}</p>
            </div>
            {!receiptUrl ? (
              <p className="rounded-md bg-[#f8fbfd] p-4 text-sm text-[#64748b]">No bill or invoice was uploaded for this request.</p>
            ) : receiptUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe src={receiptUrl} className="h-[460px] w-full rounded-md border border-[#d7e0e8]" title="Receipt PDF" />
            ) : (
              <img src={receiptUrl} alt="Receipt" className="max-h-[60vh] w-full rounded-md object-contain" />
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(claimToDelete)}
        centered
        width={360}
        footer={null}
        closable={false}
        onCancel={() => setClaimToDelete(null)}
        className="delete-modal"
        rootClassName="delete-modal-root"
      >
        <p className="mb-5 text-center text-base font-medium text-[#172033]">Are you sure want to delete</p>
        <div className="flex justify-center gap-5">
          <button type="button" onClick={() => setClaimToDelete(null)} className="h-9 w-28 rounded-md border border-[#d7e0e8] bg-white text-sm text-[#667085]">
            Cancel
          </button>
          <button type="button" onClick={deleteRow} disabled={isDeleting} className="h-9 w-28 rounded-md bg-[#c90010] text-sm font-semibold text-white disabled:opacity-70">
            {isDeleting ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Payments;
