import authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const result = await authService.register({
      name,
      email,
      phone,
      password
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // For JWT, logout is handled on the client side by removing the token
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};
