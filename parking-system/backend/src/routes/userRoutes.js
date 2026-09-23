import express from 'express';
import { protect } from '../middleware/auth.js';
import userRepository from '../repositories/userRepository.js';

const router = express.Router();

// User profile routes
router.use(protect);

router.get('/profile', async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    
    const user = await userRepository.update(req.user.id, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

router.put('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user with password
    const user = await userRepository.findByEmail(req.user.email, true);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
