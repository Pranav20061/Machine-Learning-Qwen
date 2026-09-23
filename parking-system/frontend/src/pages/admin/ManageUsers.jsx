import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Input from '../../components/common/Input';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';

const ManageUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (roleFilter) params.role = roleFilter;
      
      const data = await adminService.getAllUsers(params);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await adminService.changeUserRole(userId, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this user?`)) return;
    try {
      await adminService.changeUserStatus(userId, { isActive: newStatus });
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container-fluid py-4"><Loader /></div>;
  if (error) return <div className="container-fluid py-4"><ErrorState message={error} onRetry={fetchUsers} /></div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Manage Users</h2>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            style={{ width: 'auto' }}
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-6">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="bi-search"
                className="mb-0"
              />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <span className="text-muted">
                Showing {filteredUsers.length} of {totalCount} users
              </span>
            </div>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No Users Found"
          message={searchTerm ? 'Try adjusting your search criteria' : 'No users available'}
        />
      ) : (
        <>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3">Name</th>
                      <th className="border-0 py-3">Email</th>
                      <th className="border-0 py-3">Phone</th>
                      <th className="border-0 py-3">Role</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3">Joined</th>
                      <th className="border-0 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="py-3 fw-semibold">{user.name}</td>
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">{user.phone || '-'}</td>
                        <td className="py-3">
                          <select
                            className={`form-select form-select-sm w-auto d-inline ${user.role === 'ADMIN' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-primary bg-opacity-10 text-primary'}`}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 text-muted small">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-end">
                          <button
                            className={`btn btn-sm ${user.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            onClick={() => handleStatusChange(user._id, !user.isActive)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
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

export default ManageUsers;
