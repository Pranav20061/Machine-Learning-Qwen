import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/parkingService';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await bookingService.getById(id);
      setBooking(response.data.booking || response.data);
    } catch (err) {
      error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await bookingService.cancel(id);
      success('Booking cancelled successfully');
      setShowCancelModal(false);
      fetchBooking();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Loader size="large" />
      </div>
    );
  }

  if (!booking) {
    return <ErrorState message="Booking not found" onRetry={() => window.location.reload()} />;
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <button className="btn btn-link" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h4 className="fw-bold mb-0">Booking Details</h4>
              <StatusBadge status={booking.status} />
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <h6 className="text-muted mb-2">Booking Information</h6>
                  <div className="mb-3">
                    <small className="text-muted d-block">Booking ID</small>
                    <span className="fw-semibold">#{booking._id}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Booking Date</small>
                    <span className="fw-semibold">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Status</small>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Payment Status</small>
                    <StatusBadge status={booking.paymentStatus} />
                  </div>
                </div>

                <div className="col-md-6">
                  <h6 className="text-muted mb-2">Parking Information</h6>
                  <div className="mb-3">
                    <small className="text-muted d-block">Location</small>
                    <span className="fw-semibold">{booking.parkingLocation?.name}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Address</small>
                    <span className="fw-semibold">{booking.parkingLocation?.address}, {booking.parkingLocation?.city}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Slot Number</small>
                    <span className="fw-semibold">{booking.parkingSlot?.slotNumber}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Slot Type</small>
                    <span className="fw-semibold">{booking.parkingSlot?.slotType}</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <h6 className="text-muted mb-2">Time Details</h6>
                  <div className="mb-3">
                    <small className="text-muted d-block">Date</small>
                    <span className="fw-semibold">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Start Time</small>
                    <span className="fw-semibold">
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">End Time</small>
                    <span className="fw-semibold">
                      {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Duration</small>
                    <span className="fw-semibold">{booking.duration} hours</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <h6 className="text-muted mb-2">Payment Details</h6>
                  <div className="mb-3">
                    <small className="text-muted d-block">Price per Hour</small>
                    <span className="fw-semibold">${(booking.totalAmount / booking.duration).toFixed(2)}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Total Amount</small>
                    <span className="fs-4 fw-bold text-primary">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="d-flex gap-2 no-print">
                {canCancel && (
                  <button className="btn btn-danger" onClick={() => setShowCancelModal(true)}>
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel Booking
                  </button>
                )}
                <button className="btn btn-outline-primary" onClick={handlePrint}>
                  <i className="bi bi-printer me-1"></i>
                  Print Receipt
                </button>
                <Link to="/bookings" className="btn btn-outline-secondary">
                  <i className="bi bi-list me-1"></i>
                  My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Need Help?</h5>
              <p className="text-muted small mb-3">
                If you have any questions about your booking, please contact our support team.
              </p>
              <div className="mb-3">
                <small className="text-muted d-block">
                  <i className="bi bi-envelope me-1"></i>
                  support@parkease.com
                </small>
                <small className="text-muted d-block">
                  <i className="bi bi-telephone me-1"></i>
                  +1 (555) 123-4567
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        variant="danger"
      />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .btn { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default BookingDetails;
