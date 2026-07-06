import { Loader2 } from 'lucide-react';

const Table = ({ columns, data, isLoading, emptyStateMessage = 'No records found' }) => {
  return (
    <div className="w-full border-4 border-black bg-white ledger-shadow overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="hidden sm:table-header-group">
          <tr className="bg-primary-600 border-b-4 border-black">
            {columns.map((column, index) => (
              <th
                key={index}
                className="p-4 font-mono font-bold text-white uppercase tracking-wider text-sm border-r-2 border-black last:border-r-0 whitespace-nowrap"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="flex flex-col sm:table-row-group">
          {isLoading ? (
            <tr className="sm:table-row flex flex-col">
              <td colSpan={columns.length} className="p-12 text-center border-t-2 border-black">
                <div className="flex flex-col items-center justify-center text-black">
                  <Loader2 className="h-10 w-10 animate-spin mb-4" />
                  <span className="font-mono font-bold uppercase tracking-widest">Loading Data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr className="sm:table-row flex flex-col">
              <td colSpan={columns.length} className="p-12 text-center border-t-2 border-black">
                <span className="font-mono font-bold uppercase text-slate-500 tracking-widest">{emptyStateMessage}</span>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                className="group border-t-4 sm:border-t-2 border-black hover:bg-primary-50 transition-colors flex flex-col sm:table-row p-4 sm:p-0"
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="p-3 sm:p-4 font-mono text-sm sm:border-r-2 border-black last:border-r-0 align-top transition-all flex sm:table-cell justify-between items-center sm:items-start border-b border-dashed border-slate-300 sm:border-none last:border-b-0"
                  >
                    <span className="sm:hidden font-bold text-slate-500 uppercase tracking-widest text-xs mr-4 flex-shrink-0">
                      {column.header}
                    </span>
                    <div className="text-right sm:text-left break-all sm:break-normal">
                      {column.render ? column.render(row) : row[column.accessor]}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
