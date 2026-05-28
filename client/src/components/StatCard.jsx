const StatCard = ({ icon: Icon, label, value, iconClassName = 'bg-[#dbeafe] text-[#1264d8]', className = '', dense = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex h-full flex-col justify-between rounded-lg border bg-white p-5 transition-all ${
      dense ? 'min-h-[118px] border-[#cbd7e1]' : 'min-h-[150px] border-[#d7e0e8] shadow-sm'
    } ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-95' : ''} ${className}`}
  >
    <div className="flex items-center gap-4">
      <div className={`flex items-center justify-center ${dense ? 'h-9 w-9 rounded-md' : 'h-10 w-10 rounded-lg'} ${iconClassName}`}>
        <Icon className={dense ? 'h-4 w-4' : 'h-5 w-5'} />
      </div>
      <p className={`${dense ? 'text-[10px] text-[#485466]' : 'text-[11px] text-[#344054]'} font-semibold uppercase tracking-wide`}>{label}</p>
    </div>
    <p className={`font-semibold tracking-tight text-[#172033] ${dense ? 'mt-5 text-2xl' : 'mt-6 text-3xl'}`}>{value}</p>
  </div>
);

export default StatCard;
