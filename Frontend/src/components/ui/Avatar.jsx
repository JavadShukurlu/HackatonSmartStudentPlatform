import { initials } from '../../utils/formatters';

const SIZES = { sm: 'h-7 w-7 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-11 w-11 text-sm' };

const Avatar = ({ name = '?', src, size = 'md', className = '' }) =>
  src ? (
    <img src={src} alt={name} className={`${SIZES[size]} rounded-full object-cover ${className}`} />
  ) : (
    <span
      className={`${SIZES[size]} inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white font-semibold ${className}`}
    >
      {initials(name) || '?'}
    </span>
  );

export default Avatar;
