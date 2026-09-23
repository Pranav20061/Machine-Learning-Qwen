const ErrorState = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="text-center py-5">
      <i
        className="bi bi-exclamation-triangle"
        style={{ fontSize: '4rem', color: '#ef4444' }}
      ></i>
      <h4 className="mt-3 text-danger">Error</h4>
      <p className="text-muted mb-3">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
