import { body, param } from 'express-validator';

export const createParkingValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Parking name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('pricePerHour')
    .notEmpty().withMessage('Price per hour is required')
    .isFloat({ min: 0 }).withMessage('Price must be greater than or equal to zero'),
  body('openingTime')
    .optional({ checkFalsy: true })
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Opening time must be in HH:MM format'),
  body('closingTime')
    .optional({ checkFalsy: true })
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Closing time must be in HH:MM format')
];

export const updateParkingValidator = [
  param('id')
    .isMongoId().withMessage('Invalid parking ID'),
  body('name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('city')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('pricePerHour')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be greater than or equal to zero'),
  body('openingTime')
    .optional({ checkFalsy: true })
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Opening time must be in HH:MM format'),
  body('closingTime')
    .optional({ checkFalsy: true })
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Closing time must be in HH:MM format')
];

export const parkingIdValidator = [
  param('id')
    .isMongoId().withMessage('Invalid parking ID')
];
