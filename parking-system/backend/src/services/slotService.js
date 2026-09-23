import parkingSlotRepository from '../repositories/parkingSlotRepository.js';
import parkingLocationRepository from '../repositories/parkingLocationRepository.js';
import { SLOT_STATUS } from '../constants/index.js';

class SlotService {
  async createSlot(data) {
    // Verify parking location exists
    const location = await parkingLocationRepository.findById(data.parkingLocation);
    if (!location) {
      throw new Error('Parking location not found');
    }

    const slot = await parkingSlotRepository.create(data);
    
    // Update parking location slot counts
    await location.updateSlotCounts();
    
    return slot;
  }

  async getSlotById(id) {
    const slot = await parkingSlotRepository.findById(id);
    if (!slot) {
      throw new Error('Parking slot not found');
    }
    return slot;
  }

  async updateSlot(id, updateData) {
    const slot = await parkingSlotRepository.findById(id);
    if (!slot) {
      throw new Error('Parking slot not found');
    }

    const updated = await parkingSlotRepository.update(id, updateData);
    
    // Update parking location slot counts if status changed
    if (updateData.status && updateData.status !== slot.status) {
      const location = await parkingLocationRepository.findById(slot.parkingLocation._id);
      if (location) {
        await location.updateSlotCounts();
      }
    }
    
    return updated;
  }

  async deleteSlot(id) {
    const slot = await parkingSlotRepository.findById(id);
    if (!slot) {
      throw new Error('Parking slot not found');
    }

    await parkingSlotRepository.delete(id);
    
    // Update parking location slot counts
    const location = await parkingLocationRepository.findById(slot.parkingLocation._id);
    if (location) {
      await location.updateSlotCounts();
    }
    
    return { message: 'Parking slot deleted successfully' };
  }

  async changeSlotStatus(id, status) {
    if (!Object.values(SLOT_STATUS).includes(status)) {
      throw new Error('Invalid slot status');
    }

    const slot = await parkingSlotRepository.findById(id);
    if (!slot) {
      throw new Error('Parking slot not found');
    }

    const updated = await parkingSlotRepository.update(id, { status });
    
    // Update parking location slot counts
    const location = await parkingLocationRepository.findById(slot.parkingLocation._id);
    if (location) {
      await location.updateSlotCounts();
    }
    
    return updated;
  }

  async getSlotsByParkingLocation(parkingLocationId, page, limit) {
    return await parkingSlotRepository.findByParkingLocation(parkingLocationId, page, limit);
  }

  async getAvailableSlots(parkingLocationId) {
    return await parkingSlotRepository.findAvailableSlots(parkingLocationId);
  }
}

export default new SlotService();
