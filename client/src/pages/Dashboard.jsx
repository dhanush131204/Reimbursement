import { useNavigate } from 'react-router-dom';
import { Banknote, FileText, Hourglass, CircleX, Plus, WalletCards } from 'lucide-react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useGetClaimsQuery } from '../store/apiSlice';
import ClaimsTable from '../components/ClaimsTable';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';

const currency = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: claims = [], isLoading } = useGetClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const isAdmin = userInfo?.role === 'ADMIN';

  const pendingRequests = claims.filter((claim) => claim.status === 'PENDING').length;
  const rejectedRequests = claims.filter((claim) => claim.status === 'REJECTED').length;
  const amountToPay = claims
    .filter((claim) => claim.status === 'APPROVED')
    .reduce((sum, claim) => sum + Number(claim.totalAmount || 0), 0);
  const paidClaims = claims.filter((claim) => claim.status === 'PAID');
  const totalPaid = paidClaims.reduce((sum, claim) => sum + Number(claim.totalAmount || 0), 0);
  const totalRequests = claims.length;

  if (!isAdmin) {
    return (
      <div className="w-full space-y-6">
        <PageHeader
          title="Overview"
          subtitle="Track your reimbursement submissions and review the latest updates on your requests."
          action={
            <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/claims/new')} className="h-9 rounded-md px-5 text-xs">
              New Reimbursement
            </Button>
          }
        />

        <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard icon={FileText} label="Total Requests" value={String(totalRequests).padStart(2, '0')} />
          <StatCard icon={Hourglass} label="Pending Requests" value={String(pendingRequests).padStart(2, '0')} iconClassName="bg-[#ffefd6] text-[#d98100]" />
          <StatCard icon={CircleX} label="Rejected Requests" value={String(rejectedRequests).padStart(2, '0')} iconClassName="bg-[#ffe1e3] text-[#e02f3e]" />
          <StatCard icon={WalletCards} label="Total Reimbursed" value={currency(totalPaid)} iconClassName="bg-[#dbeafe] text-[#1264d8]" />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-[#111827]">Recent Requests</h2>
          <ClaimsTable claims={claims.slice(0, 5)} loading={isLoading} />
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

      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-6">
        <StatCard icon={FileText} label="Total Pending" value={String(pendingRequests).padStart(2, '0')} className="md:col-span-3" dense />
        <StatCard icon={Banknote} label="Total Amount To Pay" value={currency(amountToPay)} iconClassName="bg-[#ffefd6] text-[#f59e0b]" className="md:col-span-3" dense />
        <StatCard icon={CircleX} label="Rejected Requests" value={String(rejectedRequests).padStart(2, '0')} iconClassName="bg-[#ffe1e3] text-[#e02f3e]" className="md:col-span-2" dense />
        <StatCard icon={WalletCards} label="Total Payments Count" value={String(paidClaims.length).padStart(2, '0')} iconClassName="bg-[#dbeafe] text-[#1264d8]" className="md:col-span-2" dense />
        <StatCard icon={WalletCards} label="Total Amount Paided" value={currency(totalPaid)} iconClassName="bg-[#006bd6] text-white" className="md:col-span-2" dense />
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
