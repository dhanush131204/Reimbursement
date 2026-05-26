const STATUS_STYLES = {
  APPROVED: 'bg-[#e6f0ff] text-[#1264d8]',
  PENDING: 'bg-[#fff0d8] text-[#d98100]',
  REJECTED: 'bg-[#ffe1e3] text-[#e02f3e]',
  PAID: 'bg-[#dff8ec] text-[#0b9f5a]',
};

const StatusBadge = ({ status }) => {
  const label = status || 'PENDING';
  const className = STATUS_STYLES[label] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
      {label.charAt(0) + label.slice(1).toLowerCase()}
    </span>
  );
};

export default StatusBadge;
