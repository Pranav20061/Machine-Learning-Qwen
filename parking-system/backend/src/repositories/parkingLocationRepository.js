import ParkingLocation from '../models/ParkingLocation.js';

class ParkingLocationRepository {
  async create(data) {
    return await ParkingLocation.create(data);
  }

  async findById(id) {
    return await ParkingLocation.findById(id);
  }

  async findAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = ParkingLocation.find({ ...filters, isActive: true });
    
    const [locations, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 }),
      ParkingLocation.countDocuments({ ...filters, isActive: true })
    ]);

    return {
      locations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findAllIncludingInactive(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = ParkingLocation.find(filters);
    
    const [locations, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 }),
      ParkingLocation.countDocuments(filters)
    ]);

    return {
      locations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async update(id, updateData) {
    return await ParkingLocation.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await ParkingLocation.findByIdAndDelete(id);
  }

  async count(filters = {}) {
    return await ParkingLocation.countDocuments(filters);
  }

  async search(city, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = ParkingLocation.find({
      isActive: true,
      city: { $regex: city, $options: 'i' }
    });
    
    const [locations, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 }),
      ParkingLocation.countDocuments({
        isActive: true,
        city: { $regex: city, $options: 'i' }
      })
    ]);

    return {
      locations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

export default new ParkingLocationRepository();
