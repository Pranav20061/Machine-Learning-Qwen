import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/parkingService';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const { error } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings({ limit: 5 });
      setBookings(response.data.bookings || []);
    } catch (err) {
      error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const activeBooking = bookings.find(b => b.status === 'ACTIVE' || b.status === 'CONFIRMED');
  const upcomingBookings = bookings.filter(b => 
    !['ACTIVE', 'COMPLETED', 'CANCELLED'].includes(b.status) && b !== activeBooking
  );
  const recentBookings = bookings.filter(b => 
    ['COMPLETED', 'CANCELLED'].includes(b.status)
  ).slice(0, 3);

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
        <h2 className="fw-bold">Welcome back, {user?.name}!</h2>
        <p className="text-muted">Manage your parking bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-calendar-check fs-4 text-primary"></i>
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Active Bookings</h6>
                  <h4 className="fw-bold mb-0">{activeBooking ? 1 : 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-clock-history fs-4 text-success"></i>
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Upcoming</h6>
                  <h4 className="fw-bold mb-0">{upcomingBookings.length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-check-circle fs-4 text-info"></i>
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Completed</h6>
                  <h4 className="fw-bold mb-0">{recentBookings.filter(b => b.status === 'COMPLETED').length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-x-circle fs-4 text-warning"></i>
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Cancelled</h6>
                  <h4 className="fw-bold mb-0">{recentBookings.filter(b => b.status === 'CANCELLED').length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Booking */}
      {activeBooking && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="fw-bold mb-0">Active Booking</h5>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="row">
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <small className="text-muted">Location</small>
                    <p className="fw-semibold mb-0">{activeBooking.parkingLocation?.name}</p>
                  </div>
                  <div className="col-sm-6 mb-3 mb-sm-0">
                    <small className="text-muted">Slot</small>
                    <p className="fw-semibold mb-0">{activeBooking.parkingSlot?.slotNumber}</p>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted">Date</small>
                    <p className="fw-semibold mb-0">{new Date(activeBooking.bookingDate).toLocaleDateString()}</p>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted">Time</small>
                    <p className="fw-semibold mb-0">
                      {new Date(activeBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(activeBooking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <Link to={`/booking/${activeBooking._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Recent Bookings</h5>
          <Link to="/bookings" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>
        <div className="card-body">
          {bookings.length === 0 ? (
            <EmptyState
              icon="bi-calendar-x"
              title="No Bookings Yet"
              message="Start by finding and reserving a parking spot"
              action={
                <Link to="/parking" className="btn btn-primary">
                  Find Parking
                </Link>
              }
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Location</th>
                    <th>Slot</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>#{booking._id.slice(-6)}</td>
                      <td>{booking.parkingLocation?.name}</td>
                      <td>{booking.parkingSlot?.slotNumber}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td><StatusBadge status={booking.status} /></td>
                      <td>
                        <Link to={`/booking/${booking._id}`} className="btn btn-sm btn-outline-primary">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
