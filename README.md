# StairLifeWeb - Project Management & Payment Platform

## 📋 Deskripsi Project
Platform kolaborasi untuk mengelola proyek dan pembayaran dengan fitur chat real-time. Memungkinkan freelancer dan klien untuk berkolaborasi dalam proyek dengan sistem escrow dan pembayaran yang aman.

---

## 🏗️ Project Structure
StairLifeWeb/
├── backend/    - NestJS REST API Server
├── frontend/   - Vite + Vanilla JavaScript Frontend
└── README.md   - Project Documentation

---

## 🔧 Backend Setup

### Tech Stack
- **Framework:** NestJS
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Authentication:** JWT + Passport.js
- **Real-time:** WebSocket (Socket.io)

### Features
✅ User Authentication (Register/Login)
✅ Project Management (CRUD)
✅ Application Management
✅ Contract Management
✅ Payment & Escrow System
✅ Real-time Chat with WebSocket
✅ Admin Dashboard
✅ Email Verification

### Installation

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan Supabase credentials

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

### Running Backend
```bash
npm run start:dev      # Development mode
npm run build          # Build
npm run start:prod     # Production
```

### API Endpoints

**Base URL:** `http://localhost:3000/api/v1`

#### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

#### Users
- `GET /users/me` - Get profile
- `PATCH /users/me` - Update profile
- `POST /users/me/verification` - Email verification

#### Projects
- `GET /projects` - List all projects
- `GET /projects/my` - My projects
- `POST /projects` - Create project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### Applications
- `POST /applications` - Apply to project
- `GET /applications/my` - My applications
- `PATCH /applications/:id/status` - Update status

#### Contracts
- `POST /contracts` - Create contract
- `GET /contracts/my` - My contracts
- `PATCH /contracts/:id/approve` - Approve contract

#### Payments
- `POST /payments/escrow` - Create escrow
- `PATCH /payments/escrow/:id/release` - Release payment

#### Chat
- `GET /chat/rooms` - List chat rooms
- `GET /chat/:contractId/messages` - Get messages
- `POST /chat/:contractId/messages` - Send message
- `POST /chat/direct` - Send direct message
- **WebSocket:** `ws://localhost:3000/chat`

#### Admin
- `GET /admin/stats` - Statistics
- `GET /admin/users` - List users
- `PATCH /admin/users/:id/suspend` - Suspend user
- `GET /admin/verifications` - Verification requests
- `GET /admin/disputes` - Disputes

---

## 📱 Frontend Setup

### Tech Stack
- **Build Tool:** Vite
- **Language:** Vanilla JavaScript
- **Styling:** CSS
- **HTTP Client:** Fetch API

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Running Frontend
```bash
npm run dev        # Development mode
npm run build      # Build
npm run preview    # Preview build
```

### Frontend Structure
frontend/
├── assets/         - Images, fonts, etc
├── styles/         - CSS files
├── scripts/        - JavaScript files
├── index.html      - Main HTML
└── vite.config.js  - Vite configuration

---

## 🗄️ Database Schema

### Main Tables
- **users** - User profiles & authentication
- **projects** - Project listings
- **applications** - Project applications from freelancers
- **contracts** - Contracts between client & freelancer
- **payments** - Payment records & escrow
- **chat_rooms** - Chat room data
- **messages** - Chat messages

---

## 🔐 Environment Variables

### Backend (.env)
Database
DATABASE_URL=postgresql://user:password@host/dbname
JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=3600
Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
Server
PORT=3000
NODE_ENV=development

---

## 🚀 Development Workflow

### 1. Backend Development
```bash
cd backend
npm run start:dev
```
Server akan berjalan di: `http://localhost:3000/api/v1`

### 2. Frontend Development
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di: `http://localhost:5173`

### 3. Testing API
Gunakan **Postman** atau **Thunder Client**:
1. Set Base URL: `http://localhost:3000/api/v1`
2. Set Authorization header dengan JWT token

---

## 📊 API Testing

### Quick Test dengan Postman

1. **Register User**
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json
{
"email": "user@example.com",
"password": "password123",
"firstName": "John",
"lastName": "Doe",
"role": "freelancer"
}

2. **Login**
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json
{
"email": "user@example.com",
"password": "password123"
}

3. **Get Profile** (Butuh JWT Token)
GET http://localhost:3000/api/v1/users/me
Authorization: Bearer {token_dari_login}

---

## 🔌 WebSocket Connection

### Chat Connection
```javascript
const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'your_jwt_token'
  }
});

// Join room
socket.emit('join_room', { contractId: 'xxx' });

// Send message
socket.emit('send_message', { 
  contractId: 'xxx', 
  message: 'Hello!' 
});

// Listen for messages
socket.on('receive_message', (data) => {
  console.log(data);
});
```

---

## 🐛 Troubleshooting

### Backend Issues
- **Port 3000 already in use:** 
```bash
  npx lsof -i :3000  # Check what's using port
  kill -9 <PID>     # Kill process
```

- **Database connection error:**
  - Check DATABASE_URL di .env
  - Pastikan Supabase project aktif

### Frontend Issues
- **Port 5173 already in use:**
```bash
  npm run dev -- --port 3001
```

---

## 📚 Tech Stack Summary

| Layer | Technology |
|-------|------------|
| **Frontend** | Vite + Vanilla JavaScript |
| **Backend** | NestJS + TypeScript |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Real-time** | WebSocket (Socket.io) |
| **Auth** | JWT + Passport.js |

---

## 📝 Development Notes

- TypeScript v5.x
- Node.js v16+
- Prisma untuk database management
- Escrow system untuk secure payments

---

## 👨‍💻 Team Members

- **Austin Yang** - Full Stack Developer
  - Email: austin.yang@binus.ac.id

---

## 📄 License

MIT License - Feel free to use this project!

---

## 🔗 Links

- **GitHub Repository:** https://github.com/TinnTunn/StairLifeWeb
- **Supabase Console:** https://supabase.com
- **NestJS Docs:** https://docs.nestjs.com
- **Vite Docs:** https://vitejs.dev

---

**Last Updated:** May 10, 2026