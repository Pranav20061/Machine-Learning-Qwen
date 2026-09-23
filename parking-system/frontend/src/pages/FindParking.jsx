import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import parkingService from '../services/parkingService';
import { useToast } from '../context/ToastContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import Input from '../components/common/Input';
import ParkingCard from '../components/parking/ParkingCard';

const FindParking = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [parkingLocations, setParkingLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');

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

  const filteredLocations = parkingLocations.filter(parking => {
    const matchesSearch = 
      parking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parking.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parking.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = !filterAvailable || parking.availableSlots > 0;
    
    const matchesPrice = !maxPrice || parking.pricePerHour <= parseFloat(maxPrice);
    
    return matchesSearch && matchesAvailability && matchesPrice;
  });

  const handleViewDetails = (id) => {
    navigate(`/parking/${id}`);
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
        <ErrorState message={error} onRetry={fetchParkingLocations} />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold text-dark mb-3">Find Parking</h2>
          <p className="text-muted mb-4">Search and compare parking locations to find the perfect spot for your vehicle.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <Input
                placeholder="Search by name, city or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="bi-search"
                className="mb-0"
              />
            </div>
            <div className="col-md-3">
              <div className="form-check mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="availableOnly"
                  checked={filterAvailable}
                  onChange={(e) => setFilterAvailable(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="availableOnly">
                  Available slots only
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select mt-3"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="5">$5 or less</option>
                <option value="10">$10 or less</option>
                <option value="15">$15 or less</option>
                <option value="20">$20 or less</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100 mt-3"
                onClick={() => { setSearchTerm(''); setFilterAvailable(false); setMaxPrice(''); }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredLocations.length === 0 ? (
        <EmptyState
          title="No Parking Locations Found"
          message={searchTerm || filterAvailable || maxPrice 
            ? 'Try adjusting your search criteria' 
            : 'No parking locations available at the moment'}
          actionLabel={searchTerm || filterAvailable || maxPrice ? 'Clear Filters' : undefined}
          onAction={() => { setSearchTerm(''); setFilterAvailable(false); setMaxPrice(''); }}
        />
      ) : (
        <div className="row g-4">
          {filteredLocations.map((parking) => (
            <div key={parking._id} className="col-md-6 col-lg-4">
              <ParkingCard 
                parking={parking} 
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-muted text-center">
        Showing {filteredLocations.length} of {parkingLocations.length} parking locations
      </div>
    </div>
  );
};

export default FindParking;
