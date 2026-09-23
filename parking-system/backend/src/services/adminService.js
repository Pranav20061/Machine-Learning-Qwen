import userRepository from '../repositories/userRepository.js';
import parkingLocationRepository from '../repositories/parkingLocationRepository.js';
import parkingSlotRepository from '../repositories/parkingSlotRepository.js';
import bookingRepository from '../repositories/bookingRepository.js';
import { USER_ROLES } from '../constants/index.js';

class AdminService {
  async getDashboardStats() {
    const [
      totalUsers,
      totalLocations,
      slotCounts,
      bookingStatusCounts,
      revenueStats
    ] = await Promise.all([
      userRepository.count(),
      parkingLocationRepository.count({ isActive: true }),
      parkingSlotRepository.count(),
      bookingRepository.getStatusCounts(),
      this.getRevenueForPeriod(30) // Last 30 days
    ]);

    const availableSlots = await parkingSlotRepository.count({ status: 'AVAILABLE' });
    const occupiedSlots = await parkingSlotRepository.count({ status: 'OCCUPIED' });

    const occupancyPercentage = totalLocations > 0 
      ? Math.round((occupiedSlots / slotCounts) * 100) || 0 
      : 0;

    return {
      totalUsers,
      totalLocations,
      totalSlots: slotCounts,
      availableSlots,
      occupiedSlots,
      activeBookings: (bookingStatusCounts.CONFIRMED || 0) + (bookingStatusCounts.ACTIVE || 0),
      completedBookings: bookingStatusCounts.COMPLETED || 0,
      cancelledBookings: bookingStatusCounts.CANCELLED || 0,
      totalRevenue: revenueStats.totalRevenue,
      occupancyPercentage
    };
  }

  async getAllUsers(page, limit, filters) {
    return await userRepository.findAll(page, limit, filters);
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async changeUserRole(id, role) {
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new Error('Invalid role');
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await userRepository.update(id, { role });
  }

  async changeUserStatus(id, isActive) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await userRepository.update(id, { isActive });
  }

  async getAllBookings(page, limit, filters) {
    return await bookingRepository.findAll(page, limit, filters);
  }

  async getRevenueForPeriod(days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await bookingRepository.getRevenueStats(startDate, endDate);
  }

  async getRecentBookings(limit = 5) {
    const result = await bookingRepository.findAll(1, limit, {});
    return result.bookings;
  }

  async getRecentUsers(limit = 5) {
    const result = await userRepository.findAll(1, limit, {});
    return result.users;
  }
}

export default new AdminService();
