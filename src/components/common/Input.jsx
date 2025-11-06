const Input = ({ error = false, success = false, className = '', ...props }) => {
  const base = 'w-full px-3 py-2 rounded-md border transition-shadow focus:outline-none';
  const stateClass = error
    ? 'border-red-400 bg-red-500/5 focus:ring-2 focus:ring-red-300'
    : success
    ? 'border-green-400 bg-green-500/5 focus:ring-2 focus:ring-green-300'
    : 'border-white/20 bg-white/3 focus:ring-2 focus:ring-white/10';

  return <input className={`${base} ${stateClass} ${className}`} {...props} />;
};

export default Input;
