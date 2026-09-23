import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';

const ManageBookings = () => {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      
      const data = await adminService.getAllBookings(params);
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await adminService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredBookings = bookings.filter(booking => 
    booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.parkingLocation?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container-fluid py-4"><Loader /></div>;
  if (error) return <div className="container-fluid py-4"><ErrorState message={error} onRetry={fetchBookings} /></div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Manage Bookings</h2>
        <div className="d-flex gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'CONFIRMED', label: 'Confirmed' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' }
            ]}
            className="mb-0"
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-6">
              <Input
                placeholder="Search by user or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="bi-search"
                className="mb-0"
              />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <span className="text-muted">
                Showing {filteredBookings.length} of {totalCount} bookings
              </span>
            </div>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          message={searchTerm || statusFilter ? 'Try adjusting your filters' : 'No bookings available'}
        />
      ) : (
        <>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3">Booking ID</th>
                      <th className="border-0 py-3">User</th>
                      <th className="border-0 py-3">Location</th>
                      <th className="border-0 py-3">Slot</th>
                      <th className="border-0 py-3">Date & Time</th>
                      <th className="border-0 py-3">Amount</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="py-3 small text-muted">#{booking._id.slice(-6)}</td>
                        <td className="py-3">
                          <div>{booking.user?.name || 'N/A'}</div>
                          <small className="text-muted">{booking.user?.email}</small>
                        </td>
                        <td className="py-3">{booking.parkingLocation?.name || 'N/A'}</td>
                        <td className="py-3">{booking.parkingSlot?.slotNumber || 'N/A'}</td>
                        <td className="py-3">
                          <div className="small">{formatDate(booking.bookingDate)}</div>
                          <small className="text-muted">
                            {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                            {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </small>
                        </td>
                        <td className="py-3 fw-semibold">${booking.totalAmount?.toFixed(2)}</td>
                        <td className="py-3">
                          <span className={`badge ${getStatusBadge(booking.status)} rounded-pill`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 text-end">
                          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManageBookings;
