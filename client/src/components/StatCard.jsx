const StatCard = ({ icon: Icon, label, value, iconClassName = 'bg-[#dbeafe] text-[#1264d8]' }) => (
  <div className="flex h-full min-h-[150px] flex-col justify-between rounded-lg border border-[#d7e0e8] bg-white p-5 shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#344054]">{label}</p>
    </div>
    <p className="mt-6 text-3xl font-semibold tracking-tight text-[#111827]">{value}</p>
  </div>
);

export default StatCard;
