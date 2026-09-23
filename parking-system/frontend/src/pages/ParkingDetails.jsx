import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import parkingService, { createSlot, updateSlot, deleteSlot, updateSlotStatus } from '../services/parkingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import ParkingSlotGrid from '../components/parking/ParkingSlotGrid';
import Button from '../components/common/Button';

const ParkingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const [parking, setParking] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchParkingDetails();
  }, [id]);

  const fetchParkingDetails = async () => {
    try {
      setLoading(true);
      const [parkingData, slotsData] = await Promise.all([
        parkingService.getParkingById(id),
        parkingService.getParkingSlots(id)
      ]);
      setParking(parkingData);
      setSlots(slotsData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load parking details');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot.status === 'AVAILABLE') {
      setSelectedSlot(slot);
      setShowBookingModal(true);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !bookingData.date || !bookingData.startTime || !bookingData.endTime) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setSubmitting(true);
      const bookingPayload = {
        parkingLocation: id,
        parkingSlot: selectedSlot._id,
        bookingDate: bookingData.date,
        startTime: new Date(`${bookingData.date}T${bookingData.startTime}`).toISOString(),
        endTime: new Date(`${bookingData.date}T${bookingData.endTime}`).toISOString()
      };

      await parkingService.createBooking(bookingPayload);
      toast.success('Booking created successfully!');
      setShowBookingModal(false);
      setSelectedSlot(null);
      setBookingData({ date: '', startTime: '', endTime: '' });
      fetchParkingDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <ErrorState message={error} onRetry={fetchParkingDetails} />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i>Back
      </button>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '100px', zIndex: 1 }}>
            <div className="card-body p-4">
              <h2 className="fw-bold text-dark mb-3">{parking?.name}</h2>
              <p className="text-muted mb-3">
                <i className="bi bi-geo-alt-fill me-2"></i>
                {parking?.address}, {parking?.city}
              </p>
              
              {parking?.description && (
                <p className="text-secondary mb-4">{parking.description}</p>
              )}

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <small className="text-muted d-block">Opening Time</small>
                  <strong>{parking?.openingTime}</strong>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Closing Time</small>
                  <strong>{parking?.closingTime}</strong>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Price/Hour</small>
                  <strong className="text-primary">${parking?.pricePerHour?.toFixed(2)}</strong>
                </div>
                <div className="col-6">
                  <small className="text-muted d-block">Available Slots</small>
                  <strong className="text-success">{parking?.availableSlots}/{parking?.totalSlots}</strong>
                </div>
              </div>

              <div className="progress mb-3" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${(parking?.availableSlots / parking?.totalSlots) * 100}%` }}
                ></div>
              </div>

              {isAuthenticated && selectedSlot && (
                <Button className="w-100" onClick={() => setShowBookingModal(true)}>
                  <i className="bi bi-calendar-check me-2"></i>
                  Book Selected Slot
                </Button>
              )}
              
              {!isAuthenticated && (
                <div className="alert alert-info mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Please login to book a parking slot
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-semibold mb-4">Parking Slot Layout</h4>
              <ParkingSlotGrid
                slots={slots}
                selectedSlot={selectedSlot}
                onSlotSelect={handleSlotSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onClose={() => { setShowBookingModal(false); setSelectedSlot(null); }}
        title="Book Parking Slot"
      >
        <form onSubmit={handleBookingSubmit}>
          {selectedSlot && (
            <div className="alert alert-info mb-3">
              <strong>Slot:</strong> {selectedSlot.slotNumber} ({selectedSlot.slotType})
            </div>
          )}
          
          <div className="mb-3">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              className="form-control"
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Start Time</label>
              <input
                type="time"
                className="form-control"
                value={bookingData.startTime}
                onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">End Time</label>
              <input
                type="time"
                className="form-control"
                value={bookingData.endTime}
                onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => { setShowBookingModal(false); setSelectedSlot(null); }}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ParkingDetails;
