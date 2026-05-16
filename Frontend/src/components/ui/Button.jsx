const VARIANTS = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  danger: 'btn-danger',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'px-5 py-3 text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  className = '',
  children,
  ...props
}) => (
  <button className={`${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props}>
    {loading ? (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    ) : (
      LeftIcon && <LeftIcon size={16} />
    )}
    {children}
    {RightIcon && !loading && <RightIcon size={16} />}
  </button>
);

export default Button;
