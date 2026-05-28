import { DatePicker, Select, Button } from 'antd';
import { CalendarDays, Filter, RotateCcw } from 'lucide-react';

const categoryOptions = ['All Categories', 'Meals', 'Travel', 'Software', 'Office Supplies', 'Transport', 'Equipment', 'Other'];
const statusOptions = ['All Statuses', 'APPROVED', 'PENDING', 'REJECTED', 'PAID'];

const ClaimsFilterBar = ({ filters, onChange, onClear, onApply, showStatus = true }) => {
  const startDate = filters.dateRange?.[0] || null;
  const endDate = filters.dateRange?.[1] || null;

  return (
    <div className="w-full rounded-lg border border-[#d7e0e8] bg-white px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--app-primary-soft)]">
            <Filter className="h-3.5 w-3.5 text-[var(--app-primary)]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold leading-tight text-[#172033]">Filters</h2>
            <p className="text-xs leading-tight text-[#64748b]">Refine the request list.</p>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 items-end gap-3 ${showStatus ? 'xl:grid-cols-[minmax(180px,0.9fr)_minmax(180px,0.9fr)_minmax(180px,1.2fr)_minmax(160px,0.8fr)_160px]' : 'xl:grid-cols-[minmax(180px,0.9fr)_minmax(180px,0.9fr)_minmax(220px,1.2fr)_160px]'}`}>
        <div className="min-w-0">
          <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#344054]">
            <CalendarDays className="h-3.5 w-3.5 text-[#64748b]" />
            Start date
          </label>
          <DatePicker
            value={startDate}
            onChange={(value) => onChange({ ...filters, dateRange: [value, endDate] })}
            className="app-control w-full"
            size="small"
          />
        </div>
        <div className="min-w-0">
          <label className="mb-1 block text-[11px] font-semibold text-[#344054]">End date</label>
          <DatePicker
            value={endDate}
            onChange={(value) => onChange({ ...filters, dateRange: [startDate, value] })}
            className="app-control w-full"
            size="small"
          />
        </div>
        <div className="min-w-0">
          <label className="mb-1 block text-[11px] font-semibold text-[#344054]">Category</label>
          <Select
            value={filters.category}
            onChange={(value) => onChange({ ...filters, category: value })}
            options={categoryOptions.map((value) => ({ value, label: value }))}
            className="w-full"
            size="small"
          />
        </div>
        {showStatus && (
          <div className="min-w-0">
            <label className="mb-1 block text-[11px] font-semibold text-[#344054]">Status</label>
            <Select
              value={filters.status}
              onChange={(value) => onChange({ ...filters, status: value })}
              options={statusOptions.map((value) => ({ value, label: value }))}
              className="w-full"
              size="small"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Button size="small" icon={<RotateCcw className="h-3.5 w-3.5" />} className="h-8 rounded-md" onClick={onClear}>
            Clear
          </Button>
          <Button type="primary" size="small" className="h-8 rounded-md" onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClaimsFilterBar;
