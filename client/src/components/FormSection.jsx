const FormSection = ({ icon: Icon, title, children }) => (
  <section className="rounded-lg border border-[#d7e0e8] bg-white p-5">
    <div className="mb-4 flex items-center gap-2 border-b border-[#edf2f7] pb-3">
      {Icon && <Icon className="h-4 w-4 text-[#00aeef]" />}
      <h2 className="text-xs font-semibold uppercase tracking-wide text-[#1686b7]">{title}</h2>
    </div>
    {children}
  </section>
);

export default FormSection;
