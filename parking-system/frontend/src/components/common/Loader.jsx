const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg',
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <div
        className={`spinner-border ${sizeClasses[size] || ''}`}
        role="status"
        style={{
          width: size === 'large' ? '3rem' : size === 'small' ? '1rem' : '2rem',
          height: size === 'large' ? '3rem' : size === 'small' ? '1rem' : '2rem',
        }}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <p className="mt-2 text-muted">{text}</p>}
    </div>
  );
};

export default Loader;
