import adminService from '../services/adminService.js';

export const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { role, isActive } = req.query;

    const filters = {};
    if (role) {
      filters.role = role;
    }
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }

    const result = await adminService.getAllUsers(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await adminService.changeUserRole(req.params.id, role);

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await adminService.changeUserStatus(req.params.id, isActive);

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;

    const filters = {};
    if (status) {
      filters.status = status;
    }

    const result = await adminService.getAllBookings(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.bookings,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentBookings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const bookings = await adminService.getRecentBookings(limit);

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const users = await adminService.getRecentUsers(limit);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
