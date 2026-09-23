import { body, param } from 'express-validator';
import { BOOKING_STATUS } from '../constants/index.js';

export const createBookingValidator = [
  body()
    .custom((_, { req }) => {
      // Accept both `parkingSlot` (frontend payload) and `parkingSlotId`
      req.body.parkingSlotId = req.body.parkingSlot || req.body.parkingSlotId;
      return true;
    }),
  body('parkingSlotId')
    .isMongoId().withMessage('Invalid parking slot ID'),
  body('bookingDate')
    .notEmpty().withMessage('Booking date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('startTime')
    .notEmpty().withMessage('Start time is required')
    .isISO8601().withMessage('Invalid start time format'),
  body('endTime')
    .notEmpty().withMessage('End time is required')
    .isISO8601().withMessage('Invalid end time format')
];

export const bookingIdValidator = [
  param('id')
    .isMongoId().withMessage('Invalid booking ID')
];

export const cancelBookingValidator = [
  param('id')
    .isMongoId().withMessage('Invalid booking ID')
];

export const userRoleValidator = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
  body('role')
    .isIn(['USER', 'ADMIN']).withMessage('Invalid role. Must be USER or ADMIN')
];

export const userStatusValidator = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),
  body('isActive')
    .isBoolean().withMessage('isActive must be a boolean value')
];
