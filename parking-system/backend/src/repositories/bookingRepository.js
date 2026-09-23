import Booking from '../models/Booking.js';

class BookingRepository {
  async create(data) {
    return await Booking.create(data);
  }

  async findById(id) {
    return await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('parkingLocation')
      .populate('parkingSlot');
  }

  async findByUser(userId, page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = Booking.find({ user: userId, ...filters });
    
    const [bookings, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 })
        .populate('parkingLocation')
        .populate('parkingSlot'),
      Booking.countDocuments({ user: userId, ...filters })
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = Booking.find(filters);
    
    const [bookings, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 })
        .populate('user', 'name email')
        .populate('parkingLocation')
        .populate('parkingSlot'),
      Booking.countDocuments(filters)
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async update(id, updateData) {
    return await Booking.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'name email')
      .populate('parkingLocation')
      .populate('parkingSlot');
  }

  async count(filters = {}) {
    return await Booking.countDocuments(filters);
  }

  async existsForSlotAndTime(parkingSlotId, startTime, endTime, excludeBookingId = null) {
    const query = {
      parkingSlot: parkingSlotId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $nin: ['CANCELLED'] }
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const count = await Booking.countDocuments(query);
    return count > 0;
  }

  async findActiveBySlot(parkingSlotId) {
    const now = new Date();
    return await Booking.findOne({
      parkingSlot: parkingSlotId,
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: { $in: ['CONFIRMED', 'ACTIVE'] }
    });
  }

  async getRevenueStats(startDate, endDate) {
    const stats = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['CONFIRMED', 'ACTIVE', 'COMPLETED'] },
          paymentStatus: 'PAID',
          bookingDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    return stats[0] || { totalRevenue: 0, totalBookings: 0 };
  }

  async getStatusCounts() {
    const counts = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {};
    counts.forEach(item => {
      result[item._id] = item.count;
    });

    return result;
  }
}

export default new BookingRepository();
