import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="block text-sm font-mono font-bold text-black mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          block w-full border-2 border-black p-3 focus:outline-none focus:ring-0 focus:border-black font-mono transition-shadow
          ${error ? 'border-red-600 bg-red-50 text-red-900 placeholder-red-300' : 'bg-white hover:ledger-shadow-sm focus:ledger-shadow'}
          disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-300 disabled:shadow-none
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm font-mono font-bold text-red-600">
          ! {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
