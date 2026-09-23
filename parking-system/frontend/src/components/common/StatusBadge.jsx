const StatusBadge = ({ status }) => {
  const getStatusClass = (s) => {
    const statusMap = {
      AVAILABLE: 'status-available',
      OCCUPIED: 'status-occupied',
      RESERVED: 'status-reserved',
      MAINTENANCE: 'status-maintenance',
      PENDING: 'status-confirmed',
      CONFIRMED: 'status-confirmed',
      ACTIVE: 'status-active',
      COMPLETED: 'status-completed',
      CANCELLED: 'status-cancelled',
    };
    return statusMap[s] || 'status-confirmed';
  };

  const formatStatus = (s) => {
    return s.charAt(0) + s.slice(1).toLowerCase();
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
