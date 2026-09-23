import bookingService from '../services/bookingService.js';

export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;

    const filters = {};
    if (status) {
      filters.status = status;
    }

    const result = await bookingService.getMyBookings(req.user.id, page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user.id, false);

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id, false);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status, parkingLocation, user } = req.query;

    const filters = {};
    if (status) {
      filters.status = status;
    }
    if (parkingLocation) {
      filters.parkingLocation = parkingLocation;
    }
    if (user) {
      filters.user = user;
    }

    const result = await bookingService.getAllBookings(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const adminCancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id, true);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully by admin',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
