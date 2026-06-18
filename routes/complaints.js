const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// @route   POST /api/complaints
// @desc    Submit a complaint
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, isAnonymous } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const complaint = await Complaint.create({
      title,
      description,
      category,
      isAnonymous: isAnonymous === 'true',
      image: imageUrl,
      student: req.user._id,
    });

    await complaint.populate('student', 'name email studentId department');

    // Emit real-time event
    const io = req.app.get('io');
    io.emit('new_complaint', { complaint });

    res.status(201).json({ success: true, message: 'Complaint submitted successfully', complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/complaints/my
// @desc    Get current user's complaints
router.get('/my', protect, async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;
    const query = { student: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('student', 'name email studentId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, complaints, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name email studentId department year')
      .populate('comments.author', 'name role');

    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    // Students can only view their own complaints
    if (req.user.role !== 'admin' && complaint.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/complaints/:id/feedback
// @desc    Submit feedback after resolution
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
    if (complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (complaint.status !== 'resolved') {
      return res.status(400).json({ success: false, message: 'Can only rate resolved complaints' });
    }

    complaint.feedback = { rating, comment, submittedAt: new Date() };
    await complaint.save();

    res.json({ success: true, message: 'Feedback submitted', complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/complaints/suggestions/keywords
// @desc    Get keyword suggestions based on partial input
router.get('/suggestions/keywords', protect, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, suggestions: [] });

  const allKeywords = [
    'fire hazard', 'electrical issue', 'emergency situation', 'accident reported',
    'wifi not working', 'lab equipment broken', 'computer malfunction', 'projector issue',
    'cleaning required', 'fan not working', 'classroom maintenance', 'broken bench',
    'water leakage', 'power outage', 'network down', 'printer broken',
  ];

  const suggestions = allKeywords.filter(k => k.toLowerCase().includes(q.toLowerCase()));
  res.json({ success: true, suggestions });
});

module.exports = router;
