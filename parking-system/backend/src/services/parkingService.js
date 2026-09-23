import parkingLocationRepository from '../repositories/parkingLocationRepository.js';
import parkingSlotRepository from '../repositories/parkingSlotRepository.js';

class ParkingService {
  async getAllParkingLocations(page, limit, filters) {
    return await parkingLocationRepository.findAll(page, limit, filters);
  }

  async getParkingLocationById(id) {
    const location = await parkingLocationRepository.findById(id);
    if (!location) {
      throw new Error('Parking location not found');
    }
    return location;
  }

  async createParkingLocation(data) {
    const location = await parkingLocationRepository.create(data);
    return location;
  }

  async updateParkingLocation(id, updateData) {
    const location = await parkingLocationRepository.findById(id);
    if (!location) {
      throw new Error('Parking location not found');
    }
    
    const updated = await parkingLocationRepository.update(id, updateData);
    return updated;
  }

  async deleteParkingLocation(id) {
    const location = await parkingLocationRepository.findById(id);
    if (!location) {
      throw new Error('Parking location not found');
    }
    
    // Soft delete by setting isActive to false
    await parkingLocationRepository.update(id, { isActive: false });
    return { message: 'Parking location deleted successfully' };
  }

  async searchParking(city, page, limit) {
    return await parkingLocationRepository.search(city, page, limit);
  }

  async getParkingSlots(parkingLocationId, page, limit) {
    const location = await parkingLocationRepository.findById(parkingLocationId);
    if (!location) {
      throw new Error('Parking location not found');
    }
    
    return await parkingSlotRepository.findByParkingLocation(parkingLocationId, page, limit);
  }

  async getParkingStats() {
    const locations = await parkingLocationRepository.count({ isActive: true });
    const slots = await parkingSlotRepository.count();
    const availableSlots = await parkingSlotRepository.count({ status: 'AVAILABLE' });
    const occupiedSlots = await parkingSlotRepository.count({ status: 'OCCUPIED' });
    
    return {
      totalLocations: locations,
      totalSlots: slots,
      availableSlots,
      occupiedSlots
    };
  }
}

export default new ParkingService();
