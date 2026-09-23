import parkingService from '../services/parkingService.js';

export const getAllParking = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { city, search } = req.query;

    const filters = {};
    if (city) {
      filters.city = { $regex: city, $options: 'i' };
    }
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const result = await parkingService.getAllParkingLocations(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.locations,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getParkingById = async (req, res, next) => {
  try {
    const location = await parkingService.getParkingLocationById(req.params.id);

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

export const createParking = async (req, res, next) => {
  try {
    const location = await parkingService.createParkingLocation(req.body);

    res.status(201).json({
      success: true,
      message: 'Parking location created successfully',
      data: location
    });
  } catch (error) {
    next(error);
  }
};

export const updateParking = async (req, res, next) => {
  try {
    const location = await parkingService.updateParkingLocation(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Parking location updated successfully',
      data: location
    });
  } catch (error) {
    next(error);
  }
};

export const deleteParking = async (req, res, next) => {
  try {
    await parkingService.deleteParkingLocation(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Parking location deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getParkingSlots = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const result = await parkingService.getParkingSlots(req.params.id, page, limit);

    res.status(200).json({
      success: true,
      data: result.slots,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};
