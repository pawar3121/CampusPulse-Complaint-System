# 🎓 CampusPulse — Intelligent Complaint Prioritization System

A full-stack web application that allows college students to submit complaints with **AI-powered priority detection** and automatic routing to the appropriate authority.

---

## ✨ Features

- 🤖 **Smart Prioritization** — Keyword-based detection assigns High/Medium/Low priority automatically
- 🎯 **Auto-Routing** — High → Principal | Medium → HOD | Low → Class Coordinator
- 📡 **Real-time Updates** — Socket.io pushes live status changes to students
- 📊 **Analytics Dashboard** — Charts with priority/status breakdowns (Chart.js)
- 💬 **Admin Comments** — Admins can communicate with students in-thread
- ⭐ **Feedback System** — Students rate resolved complaints
- 🔐 **JWT Auth** — Secure student + admin authentication
- 🌙 **Dark/Light Mode** — Persisted theme toggle
- 📱 **Fully Responsive** — Mobile-first design

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js + Tailwind CSS + Framer Motion |
| Backend   | Node.js + Express.js                |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT (jsonwebtoken + bcryptjs)       |
| Realtime  | Socket.io                           |
| Charts    | Chart.js + react-chartjs-2          |
| Icons     | Lucide React                        |

---

## 📁 Project Structure

```
campuspulse/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (student + admin)
│   │   └── Complaint.js     # Complaint schema with auto-prioritization
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me
│   │   ├── complaints.js    # Student complaint CRUD
│   │   ├── admin.js         # Admin management routes
│   │   └── users.js         # Profile routes
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly
│   ├── scripts/
│   │   └── seed.js          # Database seeder
│   ├── .env
│   └── server.js            # Express + Socket.io server
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Common/      # Navbar, PriorityBadge, Progress, Skeleton
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── SubmitComplaint.js
│   │   │   └── ComplaintDetail.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css        # Global styles + glassmorphism
│   ├── tailwind.config.js
│   └── .env
├── package.json             # Root scripts
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v16+ 
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone & Install

```bash
# Extract the ZIP and open in terminal
cd campuspulse

# Install all dependencies at once
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campuspulse
JWT_SECRET=campuspulse_super_secret_jwt_key_2024
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 3: Seed Database (Optional)

```bash
cd backend
node scripts/seed.js
```

This creates:
- **Admin**: `admin@campuspulse.com` / `Admin@123`
- **Student**: `ravi@test.com` / `Student@123`
- 8 sample complaints

### Step 4: Run the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

Or run both simultaneously from the root:
```bash
npm install -g concurrently
npm run dev
```

---

## 🔑 Test Credentials

| Role    | Email                      | Password     |
|---------|----------------------------|--------------|
| Admin   | admin@campuspulse.com      | Admin@123    |
| Student | ravi@test.com              | Student@123  |

> Or use the **Demo** buttons on the login page!

---

## 🧠 Smart Prioritization Logic

| Keywords                                          | Priority | Assigned To       | ETA     |
|---------------------------------------------------|----------|-------------------|---------|
| fire, electric, emergency, accident, danger, flood | HIGH    | Principal         | 4 hours |
| wifi, lab, system, computer, projector, internet  | MEDIUM   | HOD               | 48 hours|
| cleaning, fan, classroom, bench, chair, desk      | LOW      | Class Coordinator | 1 week  |

---

## ☁️ Deployment

### Frontend — Vercel

```bash
cd frontend
npm run build
# Upload the build/ folder to Vercel
# OR: vercel --prod
```

Set environment variables in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_SOCKET_URL=https://your-backend.railway.app
```

### Backend — Railway / Render

1. Push `backend/` to a GitHub repo
2. Connect to Railway or Render
3. Set env variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/campuspulse
   JWT_SECRET=your_secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

### Database — MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create user and get connection string
3. Whitelist `0.0.0.0/0` in Network Access
4. Replace `MONGODB_URI` in backend env

---

## 📸 Screenshots

- **Landing Page** — Animated hero with floating complaint cards
- **Student Dashboard** — Complaint list with priority badges and progress bars
- **Submit Complaint** — Smart form with live priority detection and auto-suggestions
- **Admin Dashboard** — Charts, complaint management, status updates, comments
- **Complaint Detail** — Full timeline, comments thread, feedback rating

---

## 📄 License

MIT — Built with ❤️ for campus communities.
