import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/parkingService';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

const MyBookings = () => {
  const { success, error } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelBookingId, setCancelBookingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data.bookings || response.data || []);
    } catch (err) {
      error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await bookingService.cancel(cancelBookingId);
      success('Booking cancelled successfully');
      setCancelBookingId(null);
      fetchBookings();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === 'all' || booking.status.toLowerCase() === filter;
    const matchesSearch = 
      booking.parkingLocation?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.parkingSlot?.slotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCounts = () => {
    const counts = { all: bookings.length, pending: 0, confirmed: 0, active: 0, completed: 0, cancelled: 0 };
    bookings.forEach(b => {
      const status = b.status.toLowerCase();
      if (counts[status] !== undefined) counts[status]++;
    });
    return counts;
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">My Bookings</h2>
        <p className="text-muted">View and manage your parking reservations</p>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by location or slot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All', count: counts.all },
                  { key: 'pending', label: 'Pending', count: counts.pending },
                  { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
                  { key: 'active', label: 'Active', count: counts.active },
                  { key: 'completed', label: 'Completed', count: counts.completed },
                  { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
                ].map((item) => (
                  <button
                    key={item.key}
                    className={`btn btn-sm ${filter === item.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFilter(item.key)}
                  >
                    {item.label} ({item.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon="bi-calendar-x"
          title="No Bookings Found"
          message={bookings.length === 0 ? "You haven't made any bookings yet" : "No bookings match your filters"}
          action={
            bookings.length === 0 ? (
              <Link to="/parking" className="btn btn-primary">
                Find Parking
              </Link>
            ) : (
              <button className="btn btn-primary" onClick={() => { setFilter('all'); setSearchTerm(''); }}>
                Clear Filters
              </button>
            )
          }
        />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Location</th>
                    <th>Slot</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <Link to={`/booking/${booking._id}`}>
                          #{booking._id.slice(-8)}
                        </Link>
                      </td>
                      <td>{booking.parkingLocation?.name}</td>
                      <td>{booking.parkingSlot?.slotNumber}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td>
                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>${booking.totalAmount.toFixed(2)}</td>
                      <td><StatusBadge status={booking.status} /></td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/booking/${booking._id}`} className="btn btn-sm btn-outline-primary">
                            View
                          </Link>
                          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setCancelBookingId(booking._id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!cancelBookingId}
        onClose={() => setCancelBookingId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        variant="danger"
      />
    </div>
  );
};

export default MyBookings;
