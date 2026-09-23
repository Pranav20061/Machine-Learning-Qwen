import express from 'express';
import {
  createSlot,
  getSlotById,
  updateSlot,
  deleteSlot,
  changeSlotStatus,
  getSlotsByParkingLocation,
  getAvailableSlots
} from '../controllers/slotController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createSlotValidator,
  updateSlotValidator,
  changeSlotStatusValidator,
  slotIdValidator
} from '../validators/slotValidator.js';

const router = express.Router();

// All slot routes require admin authorization
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', createSlotValidator, validate, createSlot);
router.get('/:id', slotIdValidator, validate, getSlotById);
router.put('/:id', updateSlotValidator, validate, updateSlot);
router.delete('/:id', slotIdValidator, validate, deleteSlot);
router.patch('/:id/status', changeSlotStatusValidator, validate, changeSlotStatus);
router.get('/parking/:parkingId', getSlotsByParkingLocation);
router.get('/parking/:parkingId/available', getAvailableSlots);

export default router;
