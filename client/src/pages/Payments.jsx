import { useMemo, useState } from 'react';
import { Button, Checkbox, Select, Table } from 'antd';
import { CalendarDays, Car, Eye, Laptop, Plane, ShoppingBag, Trash2 } from 'lucide-react';
import { useGetClaimsQuery } from '../store/apiSlice';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

const fallbackRows = [
  { id: 1, vizNo: '#FT-8288', category: 'Travel', expenseDate: '2023-10-24', totalAmount: 1240.5, status: 'PAID' },
  { id: 2, vizNo: '#FT-8288', category: 'Software', expenseDate: '2023-10-15', totalAmount: 299, status: 'PENDING' },
  { id: 3, vizNo: '#FT-8288', category: 'Office Supplies', expenseDate: '2023-10-10', totalAmount: 89.2, status: 'PAID' },
  { id: 4, vizNo: '#FT-8288', category: 'Transport', expenseDate: '2023-10-02', totalAmount: 32, status: 'PAID' },
];

const icons = {
  Travel: Plane,
  Software: Laptop,
  'Office Supplies': ShoppingBag,
  Transport: Car,
};

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
const formatAmount = (amount) => `$${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Payments = () => {
  const { data: claims = [], isLoading } = useGetClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const rows = claims.length ? claims.filter((claim) => ['APPROVED', 'PAID', 'PENDING'].includes(claim.status)).slice(0, 5) : fallbackRows;
  const [selectedRowKeys, setSelectedRowKeys] = useState([2]);

  const columns = useMemo(
    () => [
      {
        title: <Checkbox checked={selectedRowKeys.length === rows.length} onChange={(event) => setSelectedRowKeys(event.target.checked ? rows.map((row) => row.id) : [])} />,
        dataIndex: 'select',
        width: 70,
        render: (_, record) => <Checkbox checked={selectedRowKeys.includes(record.id)} onChange={(event) => setSelectedRowKeys((current) => (event.target.checked ? [...current, record.id] : current.filter((key) => key !== record.id)))} />,
      },
      { title: 'Request ID', dataIndex: 'vizNo', key: 'vizNo', render: (value) => <span className="font-semibold text-[#172033]">{value || '#FT-8288'}</span> },
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
      { title: 'Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount) => <span className="font-semibold text-[#172033]">{formatAmount(amount)}</span> },
      { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <StatusBadge status={status} /> },
      {
        title: 'Actions',
        key: 'actions',
        render: () => (
          <div className="flex items-center gap-5">
            <Eye className="h-4 w-4 text-[#006bd6]" />
            <Trash2 className="h-4 w-4 text-[#ff2f3f]" />
          </div>
        ),
      },
    ],
    [rows, selectedRowKeys],
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Payment Processing" subtitle="Select approved claims to process bulk payments." />

      <div className="rounded-lg border border-[#cbd7e1] bg-white p-4">
        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[1fr_1fr_1fr_110px_120px]">
          <label className="block text-[11px] font-semibold text-[#344054]">
            Date Range
            <Select
              value="Last 30 Days"
              className="mt-1 w-full"
              options={[{ value: 'Last 30 Days', label: <span className="inline-flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />Last 30 Days</span> }]}
            />
          </label>
          <label className="block text-[11px] font-semibold text-[#344054]">
            Category
            <Select value="All Categories" className="mt-1 w-full" options={[{ value: 'All Categories', label: 'All Categories' }]} />
          </label>
          <label className="block text-[11px] font-semibold text-[#344054]">
            Status
            <Select value="All Statuses" className="mt-1 w-full" options={[{ value: 'All Statuses', label: 'All Statuses' }]} />
          </label>
          <Button className="h-9 rounded-md">Reset</Button>
          <Button type="primary" className="h-9 rounded-md">Apply</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#cbd7e1] bg-white">
        <Table
          dataSource={rows}
          columns={columns}
          rowKey="id"
          loading={isLoading && !fallbackRows.length}
          tableLayout="fixed"
          className="app-table"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            size: 'small',
            className: 'app-pagination px-4 py-3',
            showTotal: (total) => `Showing 5 of ${total || 128} requests`,
          }}
        />
      </div>

      <div className="pt-20">
        <div className="grid grid-cols-1 gap-5 rounded-xl bg-white p-4 shadow-[0_3px_16px_rgba(15,23,42,0.12)] md:grid-cols-[1fr_1.25fr]">
          <Button className="h-12 rounded-lg border-0 bg-[#f5f5f5] text-base">Cancel</Button>
          <Button type="primary" className="h-12 rounded-lg text-base">Pay now</Button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
