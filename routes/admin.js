const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route   GET /api/admin/complaints
// @desc    Get all complaints with filters
router.get('/complaints', async (req, res) => {
  try {
    const { status, priority, category, assignedTo, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('student', 'name email studentId department year')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, complaints, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PATCH /api/admin/complaints/:id/status
// @desc    Update complaint status
router.patch('/complaints/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    complaint.status = status;
    if (status === 'resolved') complaint.resolvedAt = new Date();
    await complaint.save();

    // Real-time update to student
    const io = req.app.get('io');
    io.to(complaint.student.toString()).emit('complaint_updated', {
      complaintId: complaint._id,
      status,
      message: `Your complaint "${complaint.title}" status updated to ${status}`,
    });

    res.json({ success: true, message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PATCH /api/admin/complaints/:id/assign
// @desc    Re-assign complaint
router.patch('/complaints/:id/assign', async (req, res) => {
  try {
    const { assignedTo, priority } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo, priority },
      { new: true }
    ).populate('student', 'name email');

    const io = req.app.get('io');
    io.to(complaint.student._id.toString()).emit('complaint_updated', {
      complaintId: complaint._id,
      status: complaint.status,
      message: `Your complaint has been reassigned to ${assignedTo}`,
    });

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/complaints/:id/comment
// @desc    Add comment to complaint
router.post('/complaints/:id/comment', async (req, res) => {
  try {
    const { text } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });

    complaint.comments.push({
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      text,
    });
    await complaint.save();

    const io = req.app.get('io');
    io.to(complaint.student.toString()).emit('new_comment', {
      complaintId: complaint._id,
      comment: { authorName: req.user.name, text },
    });

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [total, byPriority, byStatus, byCategory, recent] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Complaint.find().sort({ createdAt: -1 }).limit(5).populate('student', 'name'),
    ]);

    const totalStudents = await User.countDocuments({ role: 'student' });
    const resolved = byStatus.find(s => s._id === 'resolved')?.count || 0;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({
      success: true,
      stats: { total, totalStudents, resolutionRate, byPriority, byStatus, byCategory, recent },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all students
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
