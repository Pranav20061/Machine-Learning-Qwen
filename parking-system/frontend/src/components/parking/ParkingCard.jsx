import React from 'react';

const ParkingCard = ({ parking, onViewDetails }) => {
  const { name, address, city, description, totalSlots, availableSlots, pricePerHour, openingTime, closingTime } = parking;

  const availabilityPercentage = totalSlots > 0 
    ? Math.round((availableSlots / totalSlots) * 100) 
    : 0;

  const getAvailabilityColor = (percentage) => {
    if (percentage > 50) return 'text-success';
    if (percentage > 20) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="card-title fw-bold text-dark mb-0">{name}</h5>
          <span className={`badge ${availableSlots > 0 ? 'bg-success' : 'bg-danger'} rounded-pill`}>
            {availableSlots > 0 ? 'Available' : 'Full'}
          </span>
        </div>
        
        <p className="text-muted small mb-2">
          <i className="bi bi-geo-alt-fill me-1"></i>
          {address}, {city}
        </p>
        
        {description && (
          <p className="text-secondary small mb-3" style={{ maxHeight: '60px', overflow: 'hidden' }}>
            {description}
          </p>
        )}

        <div className="row g-2 mb-3">
          <div className="col-6">
            <small className="text-muted d-block">Total Slots</small>
            <strong>{totalSlots}</strong>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Available</small>
            <strong className={getAvailabilityColor(availabilityPercentage)}>{availableSlots}</strong>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Price/Hour</small>
            <strong>${pricePerHour?.toFixed(2)}</strong>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Hours</small>
            <strong className="small">{openingTime} - {closingTime}</strong>
          </div>
        </div>

        <div className="progress mb-3" style={{ height: '6px' }}>
          <div
            className={`progress-bar ${availabilityPercentage > 50 ? 'bg-success' : availabilityPercentage > 20 ? 'bg-warning' : 'bg-danger'}`}
            role="progressbar"
            style={{ width: `${availabilityPercentage}%` }}
            aria-valuenow={availabilityPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={() => onViewDetails(parking._id)}
        >
          <i className="bi bi-eye me-2"></i>
          View Details
        </button>
      </div>
    </div>
  );
};

export default ParkingCard;
