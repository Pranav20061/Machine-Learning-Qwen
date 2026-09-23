import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { useToast } from '../../context/ToastContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, bookingsData, usersData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllBookings({ page: 1, limit: 5 }),
        adminService.getAllUsers({ page: 1, limit: 5 })
      ]);

      setStats(statsData);
      setRecentBookings(bookingsData.bookings || []);
      setRecentUsers(usersData.users || []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <ErrorState message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Admin Dashboard</h2>
        <button className="btn btn-outline-primary" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="bi-people"
            color="primary"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Parking Locations"
            value={stats?.totalParkingLocations || 0}
            icon="bi-geo-alt"
            color="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Total Slots"
            value={stats?.totalSlots || 0}
            icon="bi-p-square"
            color="info"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Available Slots"
            value={stats?.availableSlots || 0}
            icon="bi-check-circle"
            color="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Occupied Slots"
            value={stats?.occupiedSlots || 0}
            icon="bi-x-circle"
            color="danger"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Active Bookings"
            value={stats?.activeBookings || 0}
            icon="bi-calendar-check"
            color="warning"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Total Revenue"
            value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
            icon="bi-currency-dollar"
            color="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Occupancy Rate"
            value={`${stats?.occupancyRate?.toFixed(1) || 0}%`}
            icon="bi-pie-chart"
            color="info"
          />
        </div>
      </div>

      {/* Recent Bookings and Users */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">Recent Bookings</h5>
            </div>
            <div className="card-body p-0">
              {recentBookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-4 text-muted"></i>
                  <p className="text-muted mt-2">No recent bookings</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 py-3">User</th>
                        <th className="border-0 py-3">Location</th>
                        <th className="border-0 py-3">Status</th>
                        <th className="border-0 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="py-3">
                            {booking.user?.name || 'N/A'}
                          </td>
                          <td className="py-3">
                            {booking.parkingLocation?.name || 'N/A'}
                          </td>
                          <td className="py-3">
                            <span className={`badge ${getStatusBadge(booking.status)} rounded-pill`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 fw-semibold">
                            ${booking.totalAmount?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="card-footer bg-white border-0 py-3">
              <button 
                className="btn btn-outline-primary btn-sm w-100"
                onClick={() => navigate('/admin/bookings')}
              >
                View All Bookings
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0">Recent Users</h5>
            </div>
            <div className="card-body p-0">
              {recentUsers.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-4 text-muted"></i>
                  <p className="text-muted mt-2">No recent users</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 py-3">Name</th>
                        <th className="border-0 py-3">Email</th>
                        <th className="border-0 py-3">Role</th>
                        <th className="border-0 py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="py-3">{user.name}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">
                            <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'} rounded-pill`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-muted small">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="card-footer bg-white border-0 py-3">
              <button 
                className="btn btn-outline-primary btn-sm w-100"
                onClick={() => navigate('/admin/users')}
              >
                View All Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
