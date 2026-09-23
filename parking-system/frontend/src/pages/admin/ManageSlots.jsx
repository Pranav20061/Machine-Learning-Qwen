import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import parkingService from '../../services/parkingService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import ParkingSlotGrid from '../../components/parking/ParkingSlotGrid';
import { useToast } from '../../context/ToastContext';

const ManageSlots = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [parking, setParking] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    slotNumber: '',
    slotType: 'REGULAR',
    floor: 'Ground',
    status: 'AVAILABLE'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchParkingAndSlots();
  }, [id]);

  const fetchParkingAndSlots = async () => {
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
      toast.error('Failed to load parking data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        slotNumber: slot.slotNumber || '',
        slotType: slot.slotType || 'REGULAR',
        floor: slot.floor || 'Ground',
        status: slot.status || 'AVAILABLE'
      });
    } else {
      setEditingSlot(null);
      setFormData({
        slotNumber: '',
        slotType: 'REGULAR',
        floor: 'Ground',
        status: 'AVAILABLE'
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSlot(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.slotNumber.trim()) errors.slotNumber = 'Slot number is required';
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
        parkingLocation: id
      };

      if (editingSlot) {
        await parkingService.updateSlot(editingSlot._id, payload);
        toast.success('Slot updated successfully');
      } else {
        await parkingService.createSlot(payload);
        toast.success('Slot created successfully');
      }
      
      handleCloseModal();
      fetchParkingAndSlots();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    try {
      await parkingService.deleteSlot(slotId);
      toast.success('Slot deleted successfully');
      fetchParkingAndSlots();
    } catch (err) {
      toast.error(err.message || 'Failed to delete slot');
    }
  };

  const handleStatusChange = async (slotId, newStatus) => {
    try {
      await parkingService.updateSlotStatus(slotId, { status: newStatus });
      toast.success('Slot status updated');
      fetchParkingAndSlots();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="container-fluid py-4"><Loader /></div>;
  if (error) return <div className="container-fluid py-4"><ErrorState message={error} onRetry={fetchParkingAndSlots} /></div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0">Manage Slots - {parking?.name}</h2>
          <p className="text-muted mb-0">{parking?.address}, {parking?.city}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/parking')}>
            <i className="bi bi-arrow-left me-2"></i>Back
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <i className="bi bi-plus-lg me-2"></i>Add Slot
          </Button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-semibold mb-3">Slot Layout</h5>
          <ParkingSlotGrid 
            slots={slots} 
            selectedSlot={null}
            onSlotSelect={() => {}}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3">Slot #</th>
                  <th className="border-0 py-3">Type</th>
                  <th className="border-0 py-3">Floor</th>
                  <th className="border-0 py-3">Status</th>
                  <th className="border-0 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot._id}>
                    <td className="py-3 fw-semibold">{slot.slotNumber}</td>
                    <td className="py-3">{slot.slotType}</td>
                    <td className="py-3">{slot.floor}</td>
                    <td className="py-3">
                      <select
                        className={`form-select form-select-sm w-auto d-inline ${
                          slot.status === 'AVAILABLE' ? 'bg-success bg-opacity-10 text-success' :
                          slot.status === 'OCCUPIED' ? 'bg-danger bg-opacity-10 text-danger' :
                          slot.status === 'RESERVED' ? 'bg-warning bg-opacity-10 text-warning' :
                          'bg-secondary bg-opacity-10 text-secondary'
                        }`}
                        value={slot.status}
                        onChange={(e) => handleStatusChange(slot._id, e.target.value)}
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    </td>
                    <td className="py-3 text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => handleOpenModal(slot)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(slot._id)}
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

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={editingSlot ? 'Edit Slot' : 'Add Slot'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Slot Number"
            value={formData.slotNumber}
            onChange={(e) => setFormData({ ...formData, slotNumber: e.target.value })}
            error={formErrors.slotNumber}
            required
            placeholder="e.g., A-001"
          />
          <Select
            label="Slot Type"
            value={formData.slotType}
            onChange={(e) => setFormData({ ...formData, slotType: e.target.value })}
            options={[
              { value: 'REGULAR', label: 'Regular' },
              { value: 'EV', label: 'EV Charging' },
              { value: 'DISABLED', label: 'Disabled Access' }
            ]}
          />
          <Input
            label="Floor"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            placeholder="e.g., Ground, 1, 2"
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'AVAILABLE', label: 'Available' },
              { value: 'OCCUPIED', label: 'Occupied' },
              { value: 'RESERVED', label: 'Reserved' },
              { value: 'MAINTENANCE', label: 'Maintenance' }
            ]}
          />
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" loading={submitting}>
              {editingSlot ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSlots;
