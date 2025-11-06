const Spinner = ({ size = 6, className = '' }) => {
  const sz = `w-${size} h-${size}`; // tailwind utility; small note: if custom sizes needed, pass className
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className="animate-spin text-white/90"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
};

export default Spinner;
