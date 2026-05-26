import { DatePicker, Select, Button } from 'antd';
import { CalendarDays, Filter, RotateCcw } from 'lucide-react';

const { RangePicker } = DatePicker;

const categoryOptions = ['All Categories', 'Meals', 'Travel', 'Software', 'Office Supplies', 'Transport', 'Equipment', 'Other'];
const statusOptions = ['All Statuses', 'APPROVED', 'PENDING', 'REJECTED', 'PAID'];

const ClaimsFilterBar = ({ filters, onChange, onClear, onApply, showStatus = true }) => (
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
    <div className={`grid grid-cols-1 items-end gap-3 ${showStatus ? 'lg:grid-cols-[minmax(260px,1.2fr)_minmax(180px,0.75fr)_minmax(160px,0.7fr)_160px]' : 'lg:grid-cols-[minmax(280px,1.2fr)_minmax(200px,0.8fr)_160px]'}`}>
      <div className="min-w-0">
        <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#344054]">
          <CalendarDays className="h-3.5 w-3.5 text-[#64748b]" />
          Date Range
        </label>
        <RangePicker
          value={filters.dateRange}
          onChange={(value) => onChange({ ...filters, dateRange: value })}
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

export default ClaimsFilterBar;
