const Button = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-transform active:scale-95 select-none';
  const glass = 'bg-white/10 backdrop-blur-md border border-white/20 text-white';

  const variants = {
    primary: ` ${glass} bg-gradient-to-br from-white/10 to-white/5 shadow-sm ${base}`,
    secondary: ` ${glass} bg-white/5 ${base}`,
    icon: ` ${glass} p-2 rounded-full ${base}`,
  };

  return (
    <button className={`${variants[variant] ?? variants.primary} ${className}`} {...props}>
      {icon && <span className="opacity-90">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
