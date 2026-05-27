import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle2, Clock3, FileText, XCircle } from 'lucide-react';
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

  const clearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className="w-full space-y-5">
      <PageHeader title={config.title} subtitle={config.subtitle} />

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
