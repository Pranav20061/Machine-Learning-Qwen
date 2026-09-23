import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import parkingService from '../../services/parkingService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useToast } from '../../context/ToastContext';

const ManageParking = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [parkingLocations, setParkingLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    pricePerHour: '',
    openingTime: '08:00',
    closingTime: '22:00'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchParkingLocations();
  }, []);

  const fetchParkingLocations = async () => {
    try {
      setLoading(true);
      const data = await parkingService.getAllParking();
      setParkingLocations(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load parking locations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (parking = null) => {
    if (parking) {
      setEditingParking(parking);
      setFormData({
        name: parking.name || '',
        address: parking.address || '',
        city: parking.city || '',
        description: parking.description || '',
        pricePerHour: parking.pricePerHour?.toString() || '',
        openingTime: parking.openingTime || '08:00',
        closingTime: parking.closingTime || '22:00'
      });
    } else {
      setEditingParking(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        description: '',
        pricePerHour: '',
        openingTime: '08:00',
        closingTime: '22:00'
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingParking(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pricePerHour || parseFloat(formData.pricePerHour) < 0) {
      errors.pricePerHour = 'Valid price is required';
    }
    if (!formData.openingTime) errors.openingTime = 'Opening time is required';
    if (!formData.closingTime) errors.closingTime = 'Closing time is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        pricePerHour: parseFloat(formData.pricePerHour)
      };

      if (editingParking) {
        await parkingService.updateParking(editingParking._id, payload);
        toast.success('Parking location updated successfully');
      } else {
        await parkingService.createParking(payload);
        toast.success('Parking location created successfully');
      }
      
      handleCloseModal();
      fetchParkingLocations();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this parking location?')) return;

    try {
      await parkingService.deleteParking(id);
      toast.success('Parking location deleted successfully');
      fetchParkingLocations();
    } catch (err) {
      toast.error(err.message || 'Failed to delete parking location');
    }
  };

  const handleChangeSlot = (parkingId) => {
    navigate(`/admin/parking/${parkingId}`);
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
        <ErrorState message={error} onRetry={fetchParkingLocations} />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Manage Parking Locations</h2>
        <Button onClick={() => handleOpenModal()} icon="bi-plus-lg">
          <i className="bi bi-plus-lg me-2"></i>
          Add Parking Location
        </Button>
      </div>

      {parkingLocations.length === 0 ? (
        <EmptyState
          title="No Parking Locations"
          message="Create your first parking location to get started"
          actionLabel="Add Parking Location"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3">Name</th>
                    <th className="border-0 py-3">Address</th>
                    <th className="border-0 py-3">City</th>
                    <th className="border-0 py-3">Slots</th>
                    <th className="border-0 py-3">Price/Hour</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parkingLocations.map((parking) => (
                    <tr key={parking._id}>
                      <td className="py-3 fw-semibold">{parking.name}</td>
                      <td className="py-3">{parking.address}</td>
                      <td className="py-3">{parking.city}</td>
                      <td className="py-3">
                        <span className="badge bg-info rounded-pill">
                          {parking.availableSlots}/{parking.totalSlots}
                        </span>
                      </td>
                      <td className="py-3">${parking.pricePerHour?.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`badge ${parking.isActive ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                          {parking.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleChangeSlot(parking._id)}
                        >
                          <i className="bi bi-p-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleOpenModal(parking)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(parking._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={editingParking ? 'Edit Parking Location' : 'Add Parking Location'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            placeholder="Enter parking location name"
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={formErrors.address}
            required
            placeholder="Enter address"
          />
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            error={formErrors.city}
            required
            placeholder="Enter city"
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter description (optional)"
            type="textarea"
          />
          <div className="row">
            <div className="col-md-6">
              <Input
                label="Price Per Hour ($)"
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                error={formErrors.pricePerHour}
                required
              />
            </div>
            <div className="col-md-6">
              <Select
                label="Status"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                options={[
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' }
                ]}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Input
                label="Opening Time"
                type="time"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                error={formErrors.openingTime}
                required
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Closing Time"
                type="time"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                error={formErrors.closingTime}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingParking ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageParking;
