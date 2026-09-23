import { useToast } from '../context/ToastContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-primary';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'bi-check-circle';
      case 'error':
        return 'bi-exclamation-circle';
      case 'warning':
        return 'bi-exclamation-triangle';
      default:
        return 'bi-info-circle';
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show ${getBgColor(toast.type)} text-white mb-2`}
          role="alert"
          style={{ minWidth: '300px' }}
        >
          <div className="toast-header">
            <i className={`bi ${getIcon(toast.type)} me-2`}></i>
            <strong className="me-auto">
              {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
          <div className="toast-body">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
