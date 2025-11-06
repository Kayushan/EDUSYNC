const colorMap = {
  pending: 'bg-yellow-500 text-black/80',
  approved: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  default: 'bg-gray-500 text-white',
};

const Badge = ({ children, variant = 'info', className = '' }) => {
  const c = colorMap[variant] || colorMap.info;
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c} ${className}`}>{children}</span>;
};

export default Badge;
