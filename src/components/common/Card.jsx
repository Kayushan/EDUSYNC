const Card = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div
      className={`rounded-lg p-4 bg-white/6 backdrop-blur-md border border-white/10 shadow-sm ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
