import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCcw, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useLeads } from '../../hooks/useLeads';
import { useDebounce } from '../../hooks/useDebounce';
import Table from '../../components/table/Table';
import Pagination from '../../components/table/Pagination';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LeadsDashboard = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    assignedEmployee: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const { leads, totalCount, isLoading, error } = useLeads({
    ...filters,
    search: debouncedSearch
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value, 
      page: key === 'page' ? value : 1 
    }));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      page: 1,
      limit: 10,
      status: '',
      assignedEmployee: '',
    });
  };

  const columns = useMemo(() => [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => <span className="text-slate-400 font-bold">#{String(row.id).padStart(4, '0')}</span>
    },
    {
      header: 'Lead Name',
      accessor: 'name',
      render: (row) => (
        <div className="font-bold text-black uppercase tracking-tight">{row.name}</div>
      )
    },
    {
      header: 'Contact Info',
      accessor: 'contact',
      render: (row) => (
        <div className="text-sm">
          <div className="text-black font-bold">{row.mobile}</div>
          <div className="text-primary-600 underline decoration-2 underline-offset-2">{row.email}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: 'Assigned',
      accessor: 'assignedEmployee',
      render: (row) => <span className="uppercase font-bold text-slate-700">{row.assignedEmployee}</span>
    },
    {
      header: 'Logged',
      accessor: 'createdDate',
      render: (row) => format(new Date(row.createdDate), 'yyyy-MM-dd')
    },
    {
      header: 'Action',
      accessor: 'actions',
      render: (row) => (
        <button
          onClick={() => navigate(`/leads/${row.id}`)}
          className="flex items-center space-x-2 text-black hover:text-primary-600 font-bold uppercase text-xs tracking-widest transition-colors group-hover:translate-x-1"
        >
          <span>Open</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      )
    }
  ], [navigate]);

  const employees = ['Priya Singh', 'Amit Kumar', 'Neha Sharma', 'Rohan Desai', 'Vikram Singh'];
  const statuses = ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'];

  if (error) {
    return (
      <div className="bg-red-50 p-6 border-4 border-red-600 ledger-shadow font-mono">
        <h3 className="text-lg font-bold text-red-800 uppercase tracking-widest">System Error</h3>
        <p className="mt-2 text-red-700 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b-4 border-black pb-6 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-black uppercase tracking-tighter">Leads Ledger</h1>
          <p className="mt-2 text-sm font-mono font-bold text-slate-500 uppercase tracking-widest">
            Database of active & historical leads
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button variant="primary" className="w-full" onClick={() => navigate('/leads/new')}>
            + New Lead Record
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 bg-slate-200 p-4 border-4 border-black ledger-shadow-sm">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
            </div>
            <input
              type="text"
              placeholder="QUERY NAME, EMAIL OR PHONE..."
              className="pl-12 sm:pl-14 block w-full border-2 border-black p-3 bg-white font-mono font-bold uppercase tracking-wider text-black placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-black hover:ledger-shadow-sm focus:ledger-shadow transition-shadow text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Button variant={showFilters ? "primary" : "secondary"} className="w-full sm:w-auto" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-5 w-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Toggle Filters'}
            </Button>
            <Button variant="danger" className="w-full sm:w-auto" onClick={handleResetFilters}>
              <RefreshCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border-4 border-black ledger-shadow font-mono">
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Status Filter</label>
              <select
                className="block w-full border-2 border-black p-3 bg-white hover:ledger-shadow-sm focus:outline-none transition-shadow font-bold uppercase tracking-wider cursor-pointer"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">-- ALL STATUSES --</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase tracking-wide">Assignment Filter</label>
              <select
                className="block w-full border-2 border-black p-3 bg-white hover:ledger-shadow-sm focus:outline-none transition-shadow font-bold uppercase tracking-wider cursor-pointer"
                value={filters.assignedEmployee}
                onChange={(e) => handleFilterChange('assignedEmployee', e.target.value)}
              >
                <option value="">-- ALL EMPLOYEES --</option>
                {employees.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <Table 
            columns={columns} 
            data={leads} 
            isLoading={isLoading} 
            emptyStateMessage="NO MATCHING RECORDS FOUND IN DATABASE."
          />
          
          {!isLoading && leads.length > 0 && (
            <Pagination
              currentPage={filters.page}
              totalCount={totalCount}
              pageSize={filters.limit}
              onPageChange={(page) => handleFilterChange('page', page)}
              onPageSizeChange={(limit) => handleFilterChange('limit', limit)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsDashboard;
