import express from 'express';
import {
  getDashboard,
  getAllUsers,
  getUserById,
  changeUserRole,
  changeUserStatus,
  getAllBookings,
  getRecentBookings,
  getRecentUsers
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { userRoleValidator, userStatusValidator } from '../validators/bookingValidator.js';

const router = express.Router();

// All admin routes require admin authorization
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', userRoleValidator, validate, changeUserRole);
router.patch('/users/:id/status', userStatusValidator, validate, changeUserStatus);
router.get('/bookings', getAllBookings);
router.get('/recent-bookings', getRecentBookings);
router.get('/recent-users', getRecentUsers);

export default router;
