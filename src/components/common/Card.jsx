export const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white border-4 border-black ledger-shadow ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action }) => {
  return (
    <div className="px-6 py-6 border-b-4 border-black flex justify-between items-center bg-slate-50">
      <div>
        <h3 className="text-xl font-serif font-bold text-black uppercase tracking-tight">{title}</h3>
        {subtitle && <p className="mt-2 text-sm font-mono text-slate-600">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-6 ${className}`}>
      {children}
    </div>
  );
};
