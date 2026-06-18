const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   PATCH /api/users/profile
// @desc    Update user profile
router.patch('/profile', protect, async (req, res) => {
  try {
    const { name, department, year, studentId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, department, year, studentId },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
