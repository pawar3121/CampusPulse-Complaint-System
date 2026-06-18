/**
 * Seed script - Run with: node scripts/seed.js
 * Creates admin account + sample students + sample complaints
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Complaint = require('../models/Complaint');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuspulse';

const SAMPLE_COMPLAINTS = [
  { title: 'Fire alarm malfunction in Block A', description: 'The fire alarm in Block A corridor has been malfunctioning for 2 days. It triggered without any fire and students are confused about genuine emergencies. This is a serious safety concern.', category: 'Safety' },
  { title: 'WiFi not working in Computer Lab 3', description: 'The WiFi connection in Computer Lab 3 has been very slow and frequently disconnecting since last Monday. This is severely affecting practical sessions and student assignments.', category: 'Technical' },
  { title: 'Broken ceiling fan in Classroom 205', description: 'The ceiling fan in Classroom 205 (2nd floor, Main Building) is making loud noise and does not rotate properly. It is very hot during afternoon sessions.', category: 'Infrastructure' },
  { title: 'Lab computers crashing during exams', description: 'Multiple computers in the system lab are crashing and restarting automatically during practical exams. Students are losing their work. Immediate attention needed.', category: 'Technical' },
  { title: 'Washroom cleaning not done in Boys Hostel', description: 'The washrooms in Boys Hostel Block C have not been cleaned for 3 days. The hygiene situation is very bad. Maintenance staff are not responding.', category: 'Hostel' },
  { title: 'Electrical wiring exposed near canteen', description: 'There is exposed electrical wiring visible near the canteen entrance. Students pass by this area hundreds of times a day. This is an urgent electric hazard.', category: 'Safety' },
  { title: 'Projector not working in Seminar Hall', description: 'The projector in the main seminar hall has stopped working. Multiple presentations and lectures are being affected. The issue started 4 days ago.', category: 'Technical' },
  { title: 'Broken benches in Library', description: 'Several benches in the library reading area have broken. Students cannot sit comfortably. At least 8 benches need replacement or repair.', category: 'Infrastructure' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('🗑  Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@campuspulse.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('👤 Admin created: admin@campuspulse.com / Admin@123');

    // Create sample students
    const students = await User.insertMany([
      { name: 'Ravi Kumar', email: 'ravi@test.com', password: 'Student@123', role: 'student', studentId: '21CS001', department: 'Computer Science', year: '3rd' },
      { name: 'Priya Sharma', email: 'priya@test.com', password: 'Student@123', role: 'student', studentId: '21EC042', department: 'Electronics', year: '2nd' },
      { name: 'Arjun Patel', email: 'arjun@test.com', password: 'Student@123', role: 'student', studentId: '22ME011', department: 'Mechanical', year: '1st' },
    ]);
    console.log(`👥 ${students.length} sample students created`);

    // Create sample complaints
    for (let i = 0; i < SAMPLE_COMPLAINTS.length; i++) {
      const c = SAMPLE_COMPLAINTS[i];
      const student = students[i % students.length];
      await Complaint.create({ ...c, student: student._id });
    }
    console.log(`📋 ${SAMPLE_COMPLAINTS.length} sample complaints created`);

    console.log('\n🎉 Seed complete! Login credentials:');
    console.log('   Admin:   admin@campuspulse.com / Admin@123');
    console.log('   Student: ravi@test.com / Student@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
