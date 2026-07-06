import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';

const Pagination = ({ 
  currentPage, 
  totalCount, 
  pageSize, 
  onPageChange, 
  onPageSizeChange,
  pageSizes = [10, 25, 50]
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-4 border-t-0 border-black ledger-shadow-sm font-mono">
      <div className="flex justify-between flex-1 sm:hidden">
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:flex-wrap sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-6">
          <p className="text-sm font-bold text-black uppercase tracking-wider">
            Viewing <span className="text-primary-600 px-1">{totalCount === 0 ? 0 : startItem}-{endItem}</span> / <span className="text-primary-600 px-1">{totalCount}</span>
          </p>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-black uppercase tracking-wider">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="block w-20 pl-3 pr-8 py-2 text-sm border-2 border-black focus:outline-none focus:ring-0 focus:border-primary-600 bg-white font-bold cursor-pointer hover:ledger-shadow-sm transition-all"
            >
              {pageSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 border-2 border-r-0 border-black bg-white text-sm font-medium text-black hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed hover:ledger-shadow-sm transition-all"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            <span className="relative inline-flex items-center px-6 py-2 border-2 border-black bg-primary-600 text-sm font-bold text-white tracking-widest z-10 ledger-shadow-sm">
              {currentPage} / {totalPages === 0 ? 1 : totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative inline-flex items-center px-3 py-2 border-2 border-l-0 border-black bg-white text-sm font-medium text-black hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed hover:ledger-shadow-sm transition-all"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
