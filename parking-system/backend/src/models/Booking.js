import mongoose from 'mongoose';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/index.js';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  parkingLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLocation',
    required: [true, 'Parking location is required']
  },
  parkingSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: [true, 'Parking slot is required']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    enum: Object.values(BOOKING_STATUS),
    default: BOOKING_STATUS.CONFIRMED
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PAID
  }
}, {
  timestamps: true
});

bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ parkingSlot: 1, startTime: 1, endTime: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
