import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle2, CircleDollarSign, Clock3, FileText, XCircle } from 'lucide-react';
import { useGetClaimsQuery } from '../store/apiSlice';
import ClaimsFilterBar from '../components/ClaimsFilterBar';
import ClaimsTable from '../components/ClaimsTable';
import PageHeader from '../components/PageHeader';

const defaultFilters = {
  dateRange: null,
  category: 'All Categories',
  status: 'All Statuses',
};

const pageCopy = {
  approved: {
    title: 'Approved',
    subtitle: 'Review and manage your past reimbursement submissions.',
    status: 'APPROVED',
    icon: CheckCircle2,
    tone: 'text-[#1264d8]',
    soft: 'bg-[#e8f1ff]',
  },
  pending: {
    title: 'Pending',
    subtitle: 'Track reimbursement requests still waiting for approval.',
    status: 'PENDING',
    icon: Clock3,
    tone: 'text-[#b76a00]',
    soft: 'bg-[#fff1d6]',
  },
  rejected: {
    title: 'Rejected',
    subtitle: 'Review and manage your past reimbursement submissions.',
    status: 'REJECTED',
    icon: XCircle,
    tone: 'text-[#e02f3e]',
    soft: 'bg-[#ffe5e8]',
  },
  history: {
    title: 'Expense History',
    subtitle: 'Review and manage your past reimbursement submissions.',
    status: null,
    icon: FileText,
    tone: 'text-[var(--app-primary)]',
    soft: 'bg-[var(--app-primary-soft)]',
  },
};

const sameOrAfter = (date, start) => !start || new Date(date) >= start.startOf('day').toDate();
const sameOrBefore = (date, end) => !end || new Date(date) <= end.endOf('day').toDate();

const ClaimListPage = ({ type = 'history' }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: claims = [], isLoading } = useGetClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const config = pageCopy[type] || pageCopy.history;

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const statusMatches = config.status
        ? claim.status === config.status
        : appliedFilters.status === 'All Statuses' || claim.status === appliedFilters.status;
      const categoryMatches = appliedFilters.category === 'All Categories' || claim.category === appliedFilters.category;
      const [start, end] = appliedFilters.dateRange || [];
      const dateMatches = sameOrAfter(claim.expenseDate, start) && sameOrBefore(claim.expenseDate, end);
      return statusMatches && categoryMatches && dateMatches;
    });
  }, [claims, appliedFilters, config.status]);

  const totalAmount = useMemo(
    () => filteredClaims.reduce((sum, claim) => sum + Number(claim.totalAmount || 0), 0),
    [filteredClaims]
  );

  const StatusIcon = config.icon;

  const clearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className="w-full space-y-5">
      <PageHeader title={config.title} subtitle={config.subtitle} />

      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-full rounded-lg border border-[#d7e0e8] bg-white p-4">
          <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-md ${config.soft}`}>
            <StatusIcon className={`h-4 w-4 ${config.tone}`} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Visible Requests</p>
          <p className="mt-1 text-2xl font-semibold text-[#111827]">{String(filteredClaims.length).padStart(2, '0')}</p>
        </div>
        <div className="h-full rounded-lg border border-[#d7e0e8] bg-white p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#eaf7ef]">
            <CircleDollarSign className="h-4 w-4 text-[#0b9f5a]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Total Amount</p>
          <p className="mt-1 text-2xl font-semibold text-[#111827]">
            ${totalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="h-full rounded-lg border border-[#d7e0e8] bg-white p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#f3f6fa]">
            <FileText className="h-4 w-4 text-[#475467]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">All Requests</p>
          <p className="mt-1 text-2xl font-semibold text-[#111827]">{String(claims.length).padStart(2, '0')}</p>
        </div>
      </div>

      <ClaimsFilterBar
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
        onApply={() => setAppliedFilters(filters)}
        showStatus={!config.status}
      />
      <ClaimsTable claims={filteredClaims} loading={isLoading} showEmployee={userInfo?.role === 'ADMIN'} title={`${config.title} Requests`} />
    </div>
  );
};

export default ClaimListPage;
