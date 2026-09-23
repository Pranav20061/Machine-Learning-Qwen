import express from 'express';
import {
  getAllParking,
  getParkingById,
  createParking,
  updateParking,
  deleteParking,
  getParkingSlots
} from '../controllers/parkingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createParkingValidator,
  updateParkingValidator,
  parkingIdValidator
} from '../validators/parkingValidator.js';

const router = express.Router();

// Public routes
router.get('/', getAllParking);
router.get('/:id', parkingIdValidator, validate, getParkingById);
router.get('/:id/slots', parkingIdValidator, validate, getParkingSlots);

// Admin routes
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', createParkingValidator, validate, createParking);
router.put('/:id', updateParkingValidator, validate, updateParking);
router.delete('/:id', parkingIdValidator, validate, deleteParking);

export default router;
