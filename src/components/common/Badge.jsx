const Badge = ({ children, status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-secondary-600 text-white border-black';
      case 'contacted':
        return 'bg-primary-100 text-black border-black';
      case 'qualified':
        return 'bg-primary-600 text-white border-black';
      case 'lost':
        return 'bg-black text-white border-black';
      case 'converted':
        return 'bg-white text-black border-black';
      default:
        return 'bg-slate-200 text-black border-black';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 border-2 text-xs font-mono font-bold uppercase tracking-widest ${getStatusColor()}`}>
      {children}
    </span>
  );
};

export default Badge;
