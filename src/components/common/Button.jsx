import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', isLoading, className = '', disabled, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 border-2 border-black font-mono font-bold uppercase tracking-wider text-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ledger-shadow hover:ledger-shadow-sm active:translate-y-1 active:translate-x-1 active:shadow-none";
  
  const variants = {
    primary: "text-white bg-primary-600 hover:bg-primary-700",
    secondary: "text-black bg-white hover:bg-slate-100",
    danger: "text-white bg-black hover:bg-slate-900",
    ghost: "border-transparent text-black bg-transparent shadow-none hover:bg-slate-200 hover:shadow-none active:shadow-none active:translate-y-0 active:translate-x-0"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;
