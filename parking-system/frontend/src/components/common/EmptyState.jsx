const EmptyState = ({ icon = 'bi-inbox', title = 'No Data', message, action }) => {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon}`} style={{ fontSize: '4rem', color: '#cbd5e1' }}></i>
      <h4 className="mt-3 text-muted">{title}</h4>
      {message && <p className="text-muted mb-3">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
};

export default EmptyState;
