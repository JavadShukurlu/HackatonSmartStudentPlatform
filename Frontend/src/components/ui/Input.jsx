const Input = ({
  label,
  hint,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `in-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <LeftIcon size={16} />
          </span>
        )}
        <input
          id={inputId}
          className={`input-base ${LeftIcon ? 'pl-10' : ''} ${RightIcon ? 'pr-10' : ''} ${
            error ? 'border-rose-400 focus:ring-rose-400/30 focus:border-rose-400' : ''
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">
            <RightIcon size={16} />
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
};

export default Input;
