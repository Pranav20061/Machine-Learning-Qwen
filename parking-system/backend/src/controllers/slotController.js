import slotService from '../services/slotService.js';

export const createSlot = async (req, res, next) => {
  try {
    const slot = await slotService.createSlot(req.body);

    res.status(201).json({
      success: true,
      message: 'Parking slot created successfully',
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

export const getSlotById = async (req, res, next) => {
  try {
    const slot = await slotService.getSlotById(req.params.id);

    res.status(200).json({
      success: true,
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (req, res, next) => {
  try {
    const slot = await slotService.updateSlot(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Parking slot updated successfully',
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSlot = async (req, res, next) => {
  try {
    await slotService.deleteSlot(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Parking slot deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const changeSlotStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const slot = await slotService.changeSlotStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: 'Slot status updated successfully',
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

export const getSlotsByParkingLocation = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const result = await slotService.getSlotsByParkingLocation(req.params.parkingId, page, limit);

    res.status(200).json({
      success: true,
      data: result.slots,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req, res, next) => {
  try {
    const slots = await slotService.getAvailableSlots(req.params.parkingId);

    res.status(200).json({
      success: true,
      data: slots
    });
  } catch (error) {
    next(error);
  }
};
