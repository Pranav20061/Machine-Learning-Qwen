import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  adminCancelBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createBookingValidator,
  bookingIdValidator,
  cancelBookingValidator
} from '../validators/bookingValidator.js';

const router = express.Router();

// User routes
router.use(protect);

router.post('/', createBookingValidator, validate, createBooking);
router.get('/my', getMyBookings);
router.get('/:id', bookingIdValidator, validate, getBookingById);
router.patch('/:id/cancel', cancelBookingValidator, validate, cancelBooking);

// Admin routes
router.use(authorize('ADMIN'));
router.get('/', getAllBookings);
router.patch('/admin/:id/cancel', cancelBookingValidator, validate, adminCancelBooking);

export default router;
