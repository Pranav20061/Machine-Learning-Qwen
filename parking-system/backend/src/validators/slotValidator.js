import { body, param } from 'express-validator';
import { SLOT_STATUS, SLOT_TYPES } from '../constants/index.js';

export const createSlotValidator = [
  body('parkingLocation')
    .isMongoId().withMessage('Invalid parking location ID'),
  body('slotNumber')
    .trim()
    .notEmpty().withMessage('Slot number is required')
    .isLength({ max: 20 }).withMessage('Slot number cannot exceed 20 characters'),
  body('slotType')
    .optional()
    .isIn(Object.values(SLOT_TYPES)).withMessage('Invalid slot type'),
  body('floor')
    .optional({ checkFalsy: true })
    .isLength({ max: 20 }).withMessage('Floor cannot exceed 20 characters')
];

export const updateSlotValidator = [
  param('id')
    .isMongoId().withMessage('Invalid slot ID'),
  body('slotNumber')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 }).withMessage('Slot number cannot exceed 20 characters'),
  body('slotType')
    .optional()
    .isIn(Object.values(SLOT_TYPES)).withMessage('Invalid slot type'),
  body('status')
    .optional()
    .isIn(Object.values(SLOT_STATUS)).withMessage('Invalid slot status'),
  body('floor')
    .optional({ checkFalsy: true })
    .isLength({ max: 20 }).withMessage('Floor cannot exceed 20 characters')
];

export const changeSlotStatusValidator = [
  param('id')
    .isMongoId().withMessage('Invalid slot ID'),
  body('status')
    .isIn(Object.values(SLOT_STATUS)).withMessage('Invalid slot status')
];

export const slotIdValidator = [
  param('id')
    .isMongoId().withMessage('Invalid slot ID')
];
