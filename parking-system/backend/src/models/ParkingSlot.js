import mongoose from 'mongoose';
import { SLOT_STATUS, SLOT_TYPES } from '../constants/index.js';

const parkingSlotSchema = new mongoose.Schema({
  parkingLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLocation',
    required: [true, 'Parking location is required']
  },
  slotNumber: {
    type: String,
    required: [true, 'Slot number is required'],
    trim: true
  },
  slotType: {
    type: String,
    enum: Object.values(SLOT_TYPES),
    default: SLOT_TYPES.REGULAR
  },
  status: {
    type: String,
    enum: Object.values(SLOT_STATUS),
    default: SLOT_STATUS.AVAILABLE
  },
  floor: {
    type: String,
    default: 'Ground'
  }
}, {
  timestamps: true
});

parkingSlotSchema.index({ parkingLocation: 1, slotNumber: 1 }, { unique: true });

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

export default ParkingSlot;
