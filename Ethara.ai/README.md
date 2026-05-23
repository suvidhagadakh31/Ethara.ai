# 🚀 Team Task Manager

A production-ready, full-stack web application for team project management and task tracking with role-based access control, real-time analytics, and a modern dark UI.

**Live Demo:** [Deploy on Railway](#-deployment-on-railway)

---

## 📸 Screenshots

| Login | Dashboard | Task Board |
|-------|-----------|------------|
| Dark themed auth | Analytics & charts | Kanban-style columns |

| Projects | Tasks List | Team Members |
|----------|-----------|--------------|
| Card grid view | Filters & search | Member management |

> Add your screenshots to a `/screenshots` folder after deployment.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based registration and login
- Secure password hashing (bcrypt, 12 rounds)
- Role-based access control (Admin / Member)
- Protected routes (frontend + backend)
- Auto-logout on token expiration

### 📁 Project Management
- Create, update, delete projects (Admin only)
- Add/remove team members (Admin only)
- Project-level task overview
- Members can view assigned projects

### ✅ Task Management
- Create tasks with title, description, priority, due dates
- Assign tasks to project members
- Kanban-style board view (Todo → In Progress → Review → Done)
- **Admin:** Full CRUD on all tasks
- **Member:** Update status only on assigned tasks
- Search, filter (status/priority), sort, pagination

### 📊 Dashboard Analytics
- Task statistics (total, completed, pending, overdue)
- Completion rate percentage
- Tasks per project (bar chart)
- Status distribution (pie chart)
- Team workload visualization
- Recent activity feed

### 🎨 UI/UX
- Modern dark theme (glass-morphism design)
- Fully responsive (mobile, tablet, desktop)
- Lazy-loaded pages (code splitting)
- Loading skeletons
- Toast notifications
- Smooth animations

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6 |
| **State** | Context API, Custom Hooks |
| **Charts** | Recharts |
| **HTTP** | Axios (with interceptors) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT, bcryptjs |
| **Validation** | Custom middleware + validator.js |
| **Logging** | Morgan |
| **Deployment** | Railway, Nixpacks |

---

## 📁 Project Structure

```
team-task-manager/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI (Avatar, Badge, Modal, Spinner...)
│   │   ├── context/             # AuthContext (global state)
│   │   ├── hooks/               # useApi, useDebounce
│   │   ├── layouts/             # DashboardLayout, Sidebar, Navbar
│   │   ├── pages/               # Login, Signup, Dashboard, Projects, Tasks, Team, Profile
│   │   ├── services/            # API layer (auth, project, task, dashboard)
│   │   └── utils/               # Helpers, constants
│   ├── .env.example
│   └── vite.config.js
├── server/                      # Express Backend
│   ├── config/                  # DB connection, constants
│   ├── controllers/             # Business logic (auth, project, task, dashboard)
│   ├── middleware/              # Auth (JWT + RBAC), error handler
│   ├── models/                  # Mongoose schemas (User, Project, Task)
│   ├── routes/                  # API route definitions
│   ├── utils/                   # asyncHandler, ApiError, ApiResponse, generateToken
│   ├── validations/             # Request body validators
│   ├── seed.js                  # Demo data seeder
│   └── .env.example
├── docs/
│   └── postman_collection.json  # API testing collection
├── .gitignore
├── nixpacks.toml                # Railway build config
├── package.json                 # Root scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **MongoDB Atlas** account (free tier works)
- **Git**

### 1. Clone & Install

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
npm run install:all
```

### 2. Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/team-task-manager
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d
```

**Frontend** (`client/.env`) — optional for development:
```env
VITE_API_URL=
```

### 3. Seed Demo Data

```bash
npm run seed
```

This creates demo accounts:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskmanager.com | Admin123 |
| Member | john@taskmanager.com | Member123 |
| Member | jane@taskmanager.com | Member123 |
| Member | mike@taskmanager.com | Member123 |

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

Open **http://localhost:5173**

---

## 🌐 Deployment on Railway

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Team Task Manager"
git branch -M main
git remote add origin https://github.com/your-username/team-task-manager.git
git push -u origin main
```

### Step 2: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select your repository

### Step 3: Set Environment Variables
In Railway dashboard → **Variables** tab:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/team-task-manager
JWT_SECRET=<generate-strong-random-string>
JWT_EXPIRES_IN=7d
```

### Step 4: Deploy
Railway auto-detects `nixpacks.toml` and:
1. Installs dependencies
2. Builds the React frontend
3. Starts the Express server

### Step 5: Generate Domain
Settings → Networking → **Generate Domain**

Your app is live! 🎉

---

## 🗄️ MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster (M0 tier)
3. Create a database user (username + password)
4. Add IP to whitelist: `0.0.0.0/0` (allow all for Railway)
5. Get connection string: **Connect** → **Drivers** → Copy URI
6. Replace `<password>` in the URI with your actual password
7. Add `/team-task-manager` as the database name in the URI

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Current user | Private |
| GET | `/api/auth/users` | All users | Private |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/projects` | Create | Admin |
| GET | `/api/projects` | List all | Private |
| GET | `/api/projects/:id` | Get one | Private |
| PUT | `/api/projects/:id` | Update | Admin |
| DELETE | `/api/projects/:id` | Delete | Admin |
| POST | `/api/projects/:id/members` | Add member | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/tasks` | Create | Private (project member) |
| GET | `/api/tasks` | List (filters, pagination) | Private |
| PUT | `/api/tasks/:id` | Update | Admin: all, Member: status only |
| DELETE | `/api/tasks/:id` | Delete | Admin or creator |

**Query Parameters for GET /api/tasks:**
- `status` — todo, in-progress, review, completed
- `priority` — low, medium, high, urgent
- `search` — text search in title/description
- `sort` — dueDate, priority, status
- `page` — page number (default: 1)
- `limit` — items per page (default: 20, max: 100)

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Analytics | Private |

---

## 🔐 Role-Based Access Control

| Action | Admin | Member |
|--------|:-----:|:------:|
| Create/Edit/Delete Projects | ✅ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| View Team Members Page | ✅ | ❌ |
| Create Tasks (own projects) | ✅ | ✅ |
| Edit Task (all fields) | ✅ | ❌ |
| Update Task Status (assigned) | ✅ | ✅ |
| Delete Task (own) | ✅ | ✅ |
| Delete Task (others') | ✅ | ❌ |
| View Dashboard | ✅ | ✅ |

---

## 🧪 Testing

### Using Postman
1. Import `docs/postman_collection.json` into Postman
2. Set `baseUrl` variable to `http://localhost:5000/api`
3. Run "Login" request first (auto-saves token)
4. Test all endpoints including error cases

### Error Test Cases Included
- Duplicate email registration
- Wrong password login
- Access without token (401)
- Member creating project (403)
- Invalid ObjectId format
- Missing required fields

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
| Variable | Description | Required |
|----------|-------------|:--------:|
| `PORT` | Server port | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `JWT_EXPIRES_IN` | Token expiration (e.g., 7d) | ✅ |

### Frontend (`client/.env`)
| Variable | Description | Required |
|----------|-------------|:--------:|
| `VITE_API_URL` | API base URL (empty = same origin) | ❌ |

---

## 🏗️ Database Optimization

- **Indexes** on User.email, Project.createdBy, Project.members, Task.project+status, Task.assignedTo+status, Task.dueDate, Task.createdBy
- **Lean queries** with `.select()` to exclude unnecessary fields
- **Virtual population** for task counts (no extra queries)
- **Compound indexes** for common filter combinations
- **Pagination** to limit response sizes

---

## 📝 License

MIT — Free to use for personal and commercial projects.
