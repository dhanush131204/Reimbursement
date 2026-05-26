import { useNavigate } from 'react-router-dom';
import { FileText, Hourglass, CheckCircle, CircleX, WalletCards, Plus } from 'lucide-react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useGetClaimsQuery } from '../store/apiSlice';
import ClaimsTable from '../components/ClaimsTable';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';

const currency = (value) => `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: claims = [], isLoading } = useGetClaimsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const totalRequests = claims.length;
  const pendingRequests = claims.filter((claim) => claim.status === 'PENDING').length;
  const approvedRequests = claims.filter((claim) => claim.status === 'APPROVED' || claim.status === 'PAID').length;
  const rejectedRequests = claims.filter((claim) => claim.status === 'REJECTED').length;
  const totalReimbursed = claims
    .filter((claim) => claim.status === 'APPROVED' || claim.status === 'PAID')
    .reduce((sum, claim) => sum + Number(claim.totalAmount || 0), 0);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Track your reimbursement lifecycle and spending."
        action={
          userInfo?.role !== 'ADMIN' && (
            <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/claims/new')} className="h-9 rounded-md px-5 text-xs">
              New Reimbursement
            </Button>
          )
        }
      />

      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={FileText} label="Total Requests" value={String(totalRequests).padStart(2, '0')} />
        <StatCard icon={Hourglass} label="Pending Requests" value={String(pendingRequests).padStart(2, '0')} iconClassName="bg-[#ffefd6] text-[#d98100]" />
        <StatCard icon={CheckCircle} label="Approved Requests" value={String(approvedRequests).padStart(2, '0')} />
        <StatCard icon={CircleX} label="Rejected Requests" value={String(rejectedRequests).padStart(2, '0')} iconClassName="bg-[#ffe1e3] text-[#e02f3e]" />
        <StatCard icon={WalletCards} label="Total Reimbursed" value={currency(totalReimbursed)} iconClassName="bg-[#dbeafe] text-[#1264d8]" />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#111827]">Recent Requests</h2>
        <ClaimsTable claims={claims.slice(0, 5)} loading={isLoading} showEmployee={userInfo?.role === 'ADMIN'} />
      </div>
    </div>
  );
};

export default Dashboard;
