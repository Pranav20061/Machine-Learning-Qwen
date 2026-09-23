import ParkingSlot from '../models/ParkingSlot.js';

class ParkingSlotRepository {
  async create(data) {
    return await ParkingSlot.create(data);
  }

  async findById(id) {
    return await ParkingSlot.findById(id).populate('parkingLocation');
  }

  async findByParkingLocation(parkingLocationId, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const query = ParkingSlot.find({ parkingLocation: parkingLocationId });
    
    const [slots, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ slotNumber: 1 }),
      ParkingSlot.countDocuments({ parkingLocation: parkingLocationId })
    ]);

    return {
      slots,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async update(id, updateData) {
    return await ParkingSlot.findByIdAndUpdate(id, updateData, { new: true }).populate('parkingLocation');
  }

  async delete(id) {
    return await ParkingSlot.findByIdAndDelete(id);
  }

  async count(filters = {}) {
    return await ParkingSlot.countDocuments(filters);
  }

  async findByStatus(status) {
    return await ParkingSlot.find({ status });
  }

  async findAvailableSlots(parkingLocationId) {
    return await ParkingSlot.find({ 
      parkingLocation: parkingLocationId, 
      status: 'AVAILABLE' 
    }).sort({ slotNumber: 1 });
  }

  async countByParkingLocation(parkingLocationId) {
    const [total, available, occupied, maintenance] = await Promise.all([
      ParkingSlot.countDocuments({ parkingLocation: parkingLocationId }),
      ParkingSlot.countDocuments({ parkingLocation: parkingLocationId, status: 'AVAILABLE' }),
      ParkingSlot.countDocuments({ parkingLocation: parkingLocationId, status: 'OCCUPIED' }),
      ParkingSlot.countDocuments({ parkingLocation: parkingLocationId, status: 'MAINTENANCE' })
    ]);

    return { total, available, occupied, maintenance };
  }
}

export default new ParkingSlotRepository();
