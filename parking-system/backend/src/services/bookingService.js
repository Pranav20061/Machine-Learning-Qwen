import bookingRepository from '../repositories/bookingRepository.js';
import parkingSlotRepository from '../repositories/parkingSlotRepository.js';
import parkingLocationRepository from '../repositories/parkingLocationRepository.js';
import { BOOKING_STATUS, SLOT_STATUS } from '../constants/index.js';

class BookingService {
  async createBooking(bookingData, userId) {
    const { parkingSlotId, bookingDate, startTime, endTime } = bookingData;

    // Verify slot exists and is available
    const slot = await parkingSlotRepository.findById(parkingSlotId);
    if (!slot) {
      throw new Error('Parking slot not found');
    }

    if (slot.status !== SLOT_STATUS.AVAILABLE) {
      throw new Error('Parking slot is not available');
    }

    // Check for double booking
    const isBooked = await bookingRepository.existsForSlotAndTime(
      parkingSlotId,
      new Date(startTime),
      new Date(endTime)
    );

    if (isBooked) {
      throw new Error('This slot is already booked for the selected time');
    }

    // Get parking location for pricing
    const parkingLocation = await parkingLocationRepository.findById(slot.parkingLocation);
    if (!parkingLocation) {
      throw new Error('Parking location not found');
    }

    // Calculate duration in hours
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60)); // Round up to nearest hour

    if (durationHours <= 0) {
      throw new Error('End time must be after start time');
    }

    // Calculate total amount
    const totalAmount = durationHours * parkingLocation.pricePerHour;

    // Create booking
    const booking = await bookingRepository.create({
      user: userId,
      parkingLocation: slot.parkingLocation,
      parkingSlot: parkingSlotId,
      bookingDate,
      startTime,
      endTime,
      duration: durationHours,
      totalAmount,
      status: BOOKING_STATUS.CONFIRMED,
      paymentStatus: 'PAID'
    });

    // Update slot status to RESERVED
    await parkingSlotRepository.update(parkingSlotId, { status: SLOT_STATUS.RESERVED });

    // Update parking location available slots count
    await parkingLocation.updateSlotCounts();

    return booking;
  }

  async getMyBookings(userId, page, limit, filters) {
    return await bookingRepository.findByUser(userId, page, limit, filters);
  }

  async getBookingById(id, userId, isAdmin = false) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check authorization
    if (!isAdmin && booking.user._id.toString() !== userId) {
      throw new Error('Not authorized to view this booking');
    }

    return booking;
  }

  async cancelBooking(id, userId, isAdmin = false) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check authorization
    if (!isAdmin && booking.user._id.toString() !== userId) {
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new Error('Booking is already cancelled');
    }

    if (booking.status === BOOKING_STATUS.COMPLETED) {
      throw new Error('Cannot cancel a completed booking');
    }

    // Check if cancellation is allowed (e.g., at least 1 hour before start time)
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const hoursUntilStart = (startTime - now) / (1000 * 60 * 60);

    if (!isAdmin && hoursUntilStart < 1) {
      throw new Error('Cancellation is only allowed at least 1 hour before the booking starts');
    }

    // Update booking status
    const updatedBooking = await bookingRepository.update(id, {
      status: BOOKING_STATUS.CANCELLED,
      paymentStatus: 'REFUNDED'
    });

    // Update slot status back to AVAILABLE
    await parkingSlotRepository.update(booking.parkingSlot._id, { status: SLOT_STATUS.AVAILABLE });

    // Update parking location available slots count
    const parkingLocation = await parkingLocationRepository.findById(booking.parkingLocation._id);
    if (parkingLocation) {
      await parkingLocation.updateSlotCounts();
    }

    return updatedBooking;
  }

  async getAllBookings(page, limit, filters) {
    return await bookingRepository.findAll(page, limit, filters);
  }

  async getBookingStats() {
    const statusCounts = await bookingRepository.getStatusCounts();
    
    return {
      pending: statusCounts.PENDING || 0,
      confirmed: statusCounts.CONFIRMED || 0,
      active: statusCounts.ACTIVE || 0,
      completed: statusCounts.COMPLETED || 0,
      cancelled: statusCounts.CANCELLED || 0
    };
  }
}

export default new BookingService();
