import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'bg-primary bg-opacity-10 text-primary',
    success: 'bg-success bg-opacity-10 text-success',
    warning: 'bg-warning bg-opacity-10 text-warning',
    danger: 'bg-danger bg-opacity-10 text-danger',
    info: 'bg-info bg-opacity-10 text-info',
    secondary: 'bg-secondary bg-opacity-10 text-secondary'
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted small mb-1">{title}</p>
            <h3 className="fw-bold mb-0">{value}</h3>
            {trend && (
              <small className={`text-${trend > 0 ? 'success' : 'danger'}`}>
                <i className={`bi bi-${trend > 0 ? 'arrow-up' : 'arrow-down'}`}></i>
                {Math.abs(trend)}%
              </small>
            )}
          </div>
          <div className={`rounded-3 p-3 ${colorClasses[color]}`}>
            <i className={`bi ${icon}`} style={{ fontSize: '1.5rem' }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
