import { DatePicker, Select, Button } from 'antd';
import { CalendarDays, Filter, RotateCcw } from 'lucide-react';

const categoryOptions = ['All Categories', 'Meals', 'Travel', 'Software', 'Office Supplies', 'Transport', 'Equipment', 'Other'];
const statusOptions = ['All Statuses', 'APPROVED', 'PENDING', 'REJECTED', 'PAID'];

const ClaimsFilterBar = ({ filters, onChange, onClear, onApply, showStatus = true }) => (
  <div className="w-full rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
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

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:flex lg:items-end lg:gap-5">
      <div className="flex-1 lg:max-w-[420px]">
        <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#344054]">
          <CalendarDays className="h-3.5 w-3.5 text-[#64748b]" />
          Date Range
        </label>
        <div className="flex flex-col gap-4 sm:flex-row">
          <DatePicker
            placeholder="Start Date"
            value={filters.dateRange?.[0]}
            onChange={(date) => onChange({ ...filters, dateRange: [date, filters.dateRange?.[1] || null] })}
            className="h-9 w-full flex-1 rounded-md border-[#cbd5e1]"
            size="middle"
          />
          <DatePicker
            placeholder="End Date"
            value={filters.dateRange?.[1]}
            onChange={(date) => onChange({ ...filters, dateRange: [filters.dateRange?.[0] || null, date] })}
            className="h-9 w-full flex-1 rounded-md border-[#cbd5e1]"
            size="middle"
          />
        </div>
      </div>
      <div className="flex-1 lg:max-w-[200px]">
        <label className="mb-1 block text-[11px] font-semibold text-[#344054]">Category</label>
        <Select
          value={filters.category}
          onChange={(value) => onChange({ ...filters, category: value })}
          options={categoryOptions.map((value) => ({ value, label: value }))}
          className="w-full h-9"
          size="middle"
        />
      </div>
      {showStatus && (
        <div className="flex-1 lg:max-w-[180px]">
          <label className="mb-1 block text-[11px] font-semibold text-[#344054]">Status</label>
          <Select
            value={filters.status}
            onChange={(value) => onChange({ ...filters, status: value })}
            options={statusOptions.map((value) => ({ value, label: value }))}
            className="w-full h-9"
            size="middle"
          />
        </div>
      )}
      <div className="flex items-center gap-2 pt-2 lg:ml-auto lg:pt-0">
        <Button icon={<RotateCcw className="h-3.5 w-3.5" />} className="h-9 flex-1 rounded-md px-4 font-medium text-[#475467] lg:flex-none" onClick={onClear}>
          Clear
        </Button>
        <Button type="primary" className="h-9 flex-1 rounded-md px-6 font-semibold lg:flex-none" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  </div>
);

export default ClaimsFilterBar;
