import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../hooks/useLeads';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  // Fetch up to 1000 leads to compute overall stats for the dashboard
  const { leads, totalCount, isLoading } = useLeads({ page: 1, limit: 1000 });

  const newCount = leads.filter(l => l.status === 'New').length;
  const contactedCount = leads.filter(l => l.status === 'Contacted').length;
  const qualifiedCount = leads.filter(l => l.status === 'Qualified').length;
  const convertedCount = leads.filter(l => l.status === 'Converted').length;
  const lostCount = leads.filter(l => l.status === 'Lost').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b-4 border-black pb-6 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-black uppercase tracking-tighter">Command Dashboard</h1>
          <p className="mt-2 text-sm font-mono font-bold text-slate-500 uppercase tracking-widest">
            Enterprise ERP System
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button variant="primary" className="w-full" onClick={() => navigate('/leads/new')}>
            <Plus className="h-5 w-5 mr-2" />
            Log New Lead
          </Button>
        </div>
      </div>

      <div className="border-4 border-black bg-white p-6 sm:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 border-b-4 border-black pb-4">
          <h2 className="text-xl sm:text-2xl font-serif font-black uppercase inline-block">
            Pipeline Sequence
          </h2>
          <p className="text-sm font-mono font-bold uppercase text-slate-500 mt-2 md:mt-0">
            Total Pipeline Volume: {isLoading ? '...' : totalCount}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-0">
          <div className="flex-1 border-l-4 md:border-l-0 md:border-t-4 border-black pt-4 pl-4 md:pl-0 md:pr-4 relative pb-8 md:pb-0">
             <div className="absolute -left-[14px] top-0 md:-top-[14px] md:left-0 w-6 h-6 bg-primary-500 border-4 border-black rounded-full" />
             <div className="text-sm font-mono font-bold uppercase text-slate-500 mb-1 tracking-widest">01 / Inbound</div>
             <div className="text-4xl font-serif font-black mt-2">{isLoading ? '...' : newCount} <span className="block text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mt-1">New Leads</span></div>
          </div>
          <div className="flex-1 border-l-4 md:border-l-0 md:border-t-4 border-black pt-4 pl-4 md:pl-0 md:pr-4 relative pb-8 md:pb-0">
             <div className="absolute -left-[14px] top-0 md:-top-[14px] md:left-0 w-6 h-6 bg-white border-4 border-black rounded-full" />
             <div className="text-sm font-mono font-bold uppercase text-slate-500 mb-1 tracking-widest">02 / Outreach</div>
             <div className="text-4xl font-serif font-black mt-2">{isLoading ? '...' : contactedCount} <span className="block text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mt-1">Contacted</span></div>
          </div>
          <div className="flex-1 border-l-4 md:border-l-0 md:border-t-4 border-black pt-4 pl-4 md:pl-0 md:pr-4 relative pb-8 md:pb-0">
             <div className="absolute -left-[14px] top-0 md:-top-[14px] md:left-0 w-6 h-6 bg-slate-300 border-4 border-black rounded-full" />
             <div className="text-sm font-mono font-bold uppercase text-slate-500 mb-1 tracking-widest">03 / Vetting</div>
             <div className="text-4xl font-serif font-black mt-2">{isLoading ? '...' : qualifiedCount} <span className="block text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mt-1">Qualified</span></div>
          </div>
          <div className="flex-1 border-l-4 md:border-l-0 md:border-t-4 border-black pt-4 pl-4 md:pl-0 md:pr-4 relative pb-8 md:pb-0">
             <div className="absolute -left-[14px] top-0 md:-top-[14px] md:left-0 w-6 h-6 bg-secondary-500 border-4 border-black rounded-full" />
             <div className="text-sm font-mono font-bold uppercase text-secondary-600 mb-1 tracking-widest">04 / Won</div>
             <div className="text-4xl font-serif font-black mt-2">{isLoading ? '...' : convertedCount} <span className="block text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mt-1">Converted</span></div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-6 pt-8 border-t-4 border-black border-dashed">
           <div className="bg-[#e11d48] text-white p-6 flex-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 transition-transform cursor-pointer" onClick={() => navigate('/leads')}>
              <div className="text-sm font-mono font-bold uppercase tracking-widest text-rose-200 mb-2">Attrition / Lost Deals</div>
              <div className="text-5xl font-black font-serif tracking-tighter">{isLoading ? '...' : lostCount}</div>
           </div>
           <div className="bg-black text-white p-6 flex-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:translate-x-1 transition-transform cursor-pointer" onClick={() => navigate('/leads')}>
              <div className="text-sm font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">Total Conversion Rate</div>
              <div className="text-5xl font-black font-serif tracking-tighter">{isLoading ? '...' : (totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0)}%</div>
           </div>
        </div>
      </div>

      <Card>
        <CardHeader title="System Status" subtitle="Welcome to your workspace" />
        <CardContent>
          <div className="py-8">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-black mb-4 uppercase">Lead Management Module Active</h2>
            <p className="text-base font-mono text-slate-700 mb-8 max-w-2xl">
              All systems are fully operational. Access the leads ledger to manage customer interactions, log notes, and update acquisition statuses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" className="w-full sm:w-auto" onClick={() => navigate('/leads')}>
                Access Leads Ledger
              </Button>
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate('/leads/new')}>
                + Log New Lead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
