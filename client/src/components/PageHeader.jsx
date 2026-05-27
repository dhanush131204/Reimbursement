const PageHeader = ({ title, subtitle, action, titleClassName = 'text-[#111827]' }) => (
  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 className={`text-[26px] font-semibold leading-tight tracking-tight ${titleClassName}`}>{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-[#64748b]">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
