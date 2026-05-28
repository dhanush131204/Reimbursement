import { useNavigate } from 'react-router-dom';
import { Banknote, FileText, Hourglass, CircleX, Plus, WalletCards } from 'lucide-react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useGetClaimsQuery } from '../store/apiSlice';
import ClaimsTable from '../components/ClaimsTable';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { formatCurrency } from '../utils/currency';
import { useMemo, useState } from 'react';
import ClaimsFilterBar from '../components/ClaimsFilterBar';

const defaultFilters = {
  dateRange: null,
  category: 'All Categories',
  status: 'All Statuses',
};

const sameOrAfter = (date, start) => !start || new Date(date) >= start.startOf('day').toDate();
const sameOrBefore = (date, end) => !end || new Date(date) <= end.endOf('day').toDate();

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: claims = [], isLoading } = useGetClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const isAdmin = userInfo?.role === 'ADMIN';

  const pendingRequests = claims.filter((claim) => claim.status === 'PENDING').length;
  const rejectedRequests = claims.filter((claim) => claim.status === 'REJECTED').length;
  const amountToPay = claims
    .filter((claim) => claim.status === 'APPROVED')
    .reduce((sum, claim) => sum + Number(claim.totalAmount || 0), 0);
  const paidClaims = claims.filter((claim) => claim.status === 'PAID');
  const totalPaid = paidClaims.reduce((sum, claim) => sum + Number(claim.totalAmount || 0), 0);
  
  const employeeReimbursedClaims = claims.filter((claim) => claim.status === 'PAID' || claim.status === 'APPROVED');
  const employeeTotalReimbursed = employeeReimbursedClaims.reduce((sum, claim) => sum + Number(claim.totalAmount || 0), 0);

  const totalRequests = claims.length;

  const handleStatCardClick = (status) => {
    const newFilters = {
      ...filters,
      status: status,
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const statusMatches =
        appliedFilters.status === 'All Statuses' || claim.status === appliedFilters.status;
      const categoryMatches =
        appliedFilters.category === 'All Categories' || claim.category === appliedFilters.category;
      const [start, end] = appliedFilters.dateRange || [];
      const dateMatches = sameOrAfter(claim.expenseDate, start) && sameOrBefore(claim.expenseDate, end);
      return statusMatches && categoryMatches && dateMatches;
    });
  }, [claims, appliedFilters]);

  const clearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  if (!isAdmin) {
    return (
      <div className="w-full space-y-6">
        <PageHeader
          title="My Dashboard"
          subtitle="Track your reimbursement submissions and review the latest updates on your requests."
          action={
            <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/claims/new')} className="h-9 rounded-md px-5 text-xs">
              New Reimbursement
            </Button>
          }
        />

        <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Total Requests"
            value={String(totalRequests).padStart(2, '0')}
            onClick={() => handleStatCardClick('All Statuses')}
          />
          <StatCard
            icon={Hourglass}
            label="Pending Requests"
            value={String(pendingRequests).padStart(2, '0')}
            iconClassName="bg-[#ffefd6] text-[#d98100]"
            onClick={() => handleStatCardClick('PENDING')}
          />
          <StatCard
            icon={CircleX}
            label="Rejected Requests"
            value={String(rejectedRequests).padStart(2, '0')}
            iconClassName="bg-[#ffe1e3] text-[#e02f3e]"
            onClick={() => handleStatCardClick('REJECTED')}
          />
          <StatCard
            icon={WalletCards}
            label="Total Reimbursed"
            value={formatCurrency(employeeTotalReimbursed)}
            iconClassName="bg-[#dbeafe] text-[#1264d8]"
            onClick={() => handleStatCardClick('All Statuses')}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#111827]">My Requests</h2>
            {appliedFilters.status !== 'All Statuses' && (
              <span className="rounded-full bg-[var(--app-primary-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--app-primary)]">
                Filtered: {appliedFilters.status}
              </span>
            )}
          </div>

          <ClaimsFilterBar
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            onApply={() => setAppliedFilters(filters)}
            showStatus={true}
          />

          <ClaimsTable claims={filteredClaims} loading={isLoading} title="Requests" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Track your reimbursement lifecycle and spending."
      />

      <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-6">
        <StatCard icon={FileText} label="Total Pending" value={String(pendingRequests).padStart(2, '0')} className="md:col-span-3" dense />
        <StatCard icon={Banknote} label="Total Amount To Pay" value={formatCurrency(amountToPay)} iconClassName="bg-[#ffefd6] text-[#f59e0b]" className="md:col-span-3" dense />
        <StatCard icon={CircleX} label="Rejected Requests" value={String(rejectedRequests).padStart(2, '0')} iconClassName="bg-[#ffe1e3] text-[#e02f3e]" className="md:col-span-2" dense />
        <StatCard icon={WalletCards} label="Total Payments Count" value={String(paidClaims.length).padStart(2, '0')} iconClassName="bg-[#dbeafe] text-[#1264d8]" className="md:col-span-2" dense />
        <StatCard icon={WalletCards} label="Total Amount Paid" value={formatCurrency(totalPaid)} iconClassName="bg-[#006bd6] text-white" className="md:col-span-2" dense />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#111827]">Recent Requests</h2>
          <button type="button" onClick={() => navigate('/payments')} className="text-xs font-semibold text-[#006bd6]">
            View all
          </button>
        </div>
        <ClaimsTable claims={claims.slice(0, 5)} loading={isLoading} showEmployee={userInfo?.role === 'ADMIN'} compactHeader adminActions />
      </div>
    </div>
  );
};

export default Dashboard;
