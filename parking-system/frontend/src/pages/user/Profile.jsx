import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { success, error } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.name && formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data.user);
      success('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success('Password changed successfully');
      setChangePasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">My Profile</h2>
        <p className="text-muted">Manage your account information</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Profile Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Profile Information</h5>
              {!editMode && (
                <button className="btn btn-sm btn-outline-primary" onClick={() => setEditMode(true)}>
                  <i className="bi bi-pencil me-1"></i> Edit
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label text-muted">Full Name</label>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </>
                ) : (
                  <p className="fw-semibold mb-0">{user?.name}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Email Address</label>
                <p className="fw-semibold mb-0">{user?.email}</p>
                <small className="text-muted">Email cannot be changed</small>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Phone Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <p className="fw-semibold mb-0">{user?.phone || 'Not provided'}</p>
                )}
              </div>

              {editMode && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({ name: user?.name || '', phone: user?.phone || '' });
                      setErrors({});
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Security</h5>
              {!changePasswordMode && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setChangePasswordMode(true)}
                >
                  <i className="bi bi-key me-1"></i> Change Password
                </button>
              )}
            </div>
            <div className="card-body">
              {changePasswordMode ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                      value={passwordData.currentPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, currentPassword: e.target.value });
                        if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                      }}
                    />
                    {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, newPassword: e.target.value });
                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                      }}
                    />
                    {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={handleChangePassword}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setChangePasswordMode(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-muted mb-0">
                  Keep your account secure by using a strong password and changing it regularly.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-4 mb-3 d-inline-block">
                <i className="bi bi-person-circle fs-1 text-primary"></i>
              </div>
              <h5 className="fw-bold mb-1">{user?.name}</h5>
              <p className="text-muted small mb-3">{user?.email}</p>
              <span className="badge bg-primary">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
