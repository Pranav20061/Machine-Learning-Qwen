import React from 'react';

const BookingCard = ({ booking, onViewDetails }) => {
  const { 
    _id, 
    parkingLocation, 
    parkingSlot, 
    bookingDate, 
    startTime, 
    endTime, 
    totalAmount, 
    status,
    paymentStatus 
  } = booking;

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-warning',
      CONFIRMED: 'bg-info',
      ACTIVE: 'bg-primary',
      COMPLETED: 'bg-success',
      CANCELLED: 'bg-secondary'
    };
    return badges[status] || 'bg-light';
  };

  const getPaymentBadge = (status) => {
    const badges = {
      PENDING: 'bg-warning',
      PAID: 'bg-success',
      REFUNDED: 'bg-info'
    };
    return badges[status] || 'bg-light';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card border-0 shadow-sm mb-3 hover-shadow transition-all">
      <div className="card-body p-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex gap-2 mb-2">
              <span className={`badge ${getStatusBadge(status)} rounded-pill`}>
                {status}
              </span>
              <span className={`badge ${getPaymentBadge(paymentStatus)} rounded-pill`}>
                {paymentStatus}
              </span>
            </div>
            
            <h6 className="fw-bold text-dark mb-2">
              {parkingLocation?.name || 'Parking Location'}
            </h6>
            
            <p className="text-muted small mb-2">
              <i className="bi bi-geo-alt me-1"></i>
              {parkingLocation?.address}, {parkingLocation?.city}
            </p>
            
            <div className="row g-2">
              <div className="col-6 col-md-3">
                <small className="text-muted d-block">Slot</small>
                <strong>{parkingSlot?.slotNumber || 'N/A'}</strong>
              </div>
              <div className="col-6 col-md-3">
                <small className="text-muted d-block">Date</small>
                <strong>{formatDate(bookingDate)}</strong>
              </div>
              <div className="col-6 col-md-3">
                <small className="text-muted d-block">Time</small>
                <strong>{formatTime(startTime)} - {formatTime(endTime)}</strong>
              </div>
              <div className="col-6 col-md-3">
                <small className="text-muted d-block">Amount</small>
                <strong className="text-primary">${totalAmount?.toFixed(2)}</strong>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <button
              className="btn btn-outline-primary"
              onClick={() => onViewDetails(_id)}
            >
              <i className="bi bi-eye me-2"></i>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
