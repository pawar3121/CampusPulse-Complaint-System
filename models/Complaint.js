const mongoose = require('mongoose');

// Priority keywords mapping
const PRIORITY_KEYWORDS = {
  high: ['fire', 'electric', 'emergency', 'accident', 'injury', 'danger', 'urgent', 'flood', 'collapse', 'attack', 'violence', 'threat'],
  medium: ['wifi', 'lab', 'system', 'computer', 'projector', 'internet', 'network', 'software', 'hardware', 'printer', 'server', 'equipment'],
  low: ['cleaning', 'fan', 'classroom', 'bench', 'chair', 'desk', 'board', 'light', 'window', 'toilet', 'washroom', 'garden', 'maintenance'],
};

// Authority routing
const AUTHORITY_MAP = {
  high: 'Principal',
  medium: 'HOD',
  low: 'Class Coordinator',
};

// Estimated resolution times (in hours)
const RESOLUTION_TIME = {
  high: 4,
  medium: 48,
  low: 168,
};

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: String,
  authorRole: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Infrastructure', 'Academic', 'Administrative', 'Technical', 'Safety', 'Hostel', 'Other'],
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'low',
  },
  assignedTo: {
    type: String,
    enum: ['Principal', 'HOD', 'Class Coordinator'],
    default: 'Class Coordinator',
  },
  status: {
    type: String,
    enum: ['submitted', 'assigned', 'in_progress', 'resolved'],
    default: 'submitted',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  comments: [commentSchema],
  estimatedResolution: {
    type: Date,
  },
  resolvedAt: {
    type: Date,
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  complaintId: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

// Auto-generate complaint ID and analyze priority before saving
complaintSchema.pre('save', function (next) {
  if (this.isNew) {
    // Generate unique complaint ID
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.complaintId = `CP-${timestamp}-${random}`;

    // Smart priority detection
    const text = `${this.title} ${this.description}`.toLowerCase();
    let detectedPriority = 'low';

    for (const keyword of PRIORITY_KEYWORDS.high) {
      if (text.includes(keyword)) {
        detectedPriority = 'high';
        break;
      }
    }

    if (detectedPriority === 'low') {
      for (const keyword of PRIORITY_KEYWORDS.medium) {
        if (text.includes(keyword)) {
          detectedPriority = 'medium';
          break;
        }
      }
    }

    this.priority = detectedPriority;
    this.assignedTo = AUTHORITY_MAP[detectedPriority];

    // Set estimated resolution
    const hours = RESOLUTION_TIME[detectedPriority];
    this.estimatedResolution = new Date(Date.now() + hours * 60 * 60 * 1000);
    this.status = 'assigned';
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
module.exports.PRIORITY_KEYWORDS = PRIORITY_KEYWORDS;
