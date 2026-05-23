# 🚀 Railway Deployment Guide

Complete step-by-step guide to deploy the Team Task Manager on Railway.

---

## Prerequisites

- [GitHub](https://github.com) account
- [Railway](https://railway.app) account (free tier available)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free M0 cluster)
- Git installed locally

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create Cluster
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up / Log in
3. Click **"Build a Database"**
4. Select **M0 Free Tier** → Choose region closest to you
5. Click **"Create"**

### 1.2 Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Set username and password (save these!)
4. Set privileges: **"Read and write to any database"**
5. Click **"Add User"**

### 1.3 Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Click **"Confirm"**

> ⚠️ This is required for Railway to connect. For extra security, you can later restrict to Railway's IP ranges.

### 1.4 Get Connection String
1. Go to **Database** → Click **"Connect"**
2. Select **"Drivers"**
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add database name: append `/team-task-manager` before `?`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

---

## Step 2: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Production-ready Team Task Manager"

# Create main branch
git branch -M main

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git

# Push
git push -u origin main
```

---

## Step 3: Deploy on Railway

### 3.1 Create Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub Repo"**
4. Authorize Railway to access your GitHub
5. Select your `team-task-manager` repository

### 3.2 Set Environment Variables
1. Click on your deployed service
2. Go to **"Variables"** tab
3. Add these variables:

| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/team-task-manager?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-super-secret-random-string-min-32-chars` |
| `JWT_EXPIRES_IN` | `7d` |

> 💡 Generate a strong JWT_SECRET: Use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3.3 Deploy
- Railway will automatically detect `nixpacks.toml` and:
  1. Install Node.js 18
  2. Run `npm install` in root, server, and client
  3. Build the React frontend (`npm run build`)
  4. Start the server (`NODE_ENV=production node server/index.js`)

### 3.4 Generate Public URL
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Your app is now live at `https://your-app.up.railway.app`

---

## Step 4: Seed Demo Data (Optional)

After deployment, you can seed demo data using Railway's CLI or shell:

```bash
# Using Railway CLI
railway run cd server && node seed.js

# Or set MONGODB_URI locally and run
MONGODB_URI="your-atlas-uri" node server/seed.js
```

Demo accounts created:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskmanager.com | Admin123 |
| Member | john@taskmanager.com | Member123 |
| Member | jane@taskmanager.com | Member123 |
| Member | mike@taskmanager.com | Member123 |

---

## Step 5: Verify Deployment

### Verification Checklist

| # | Check | How to Verify |
|---|-------|---------------|
| 1 | ✅ App loads | Visit your Railway URL |
| 2 | ✅ Login works | Use demo credentials |
| 3 | ✅ Signup works | Create a new account |
| 4 | ✅ Dashboard loads | Check stats and charts |
| 5 | ✅ Projects CRUD | Create/edit/delete (admin) |
| 6 | ✅ Tasks CRUD | Create/assign/update status |
| 7 | ✅ RBAC enforced | Member can't create projects |
| 8 | ✅ Search/Filter | Test task search and filters |
| 9 | ✅ Responsive | Test on mobile viewport |
| 10 | ✅ Health check | Visit `/api/health` |

### Quick API Test
```bash
# Health check
curl https://your-app.up.railway.app/api/health

# Login
curl -X POST https://your-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskmanager.com","password":"Admin123"}'
```

---

## Production Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Railway                            │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │           Node.js Server (Express)            │   │
│  │                                               │   │
│  │  ┌─────────┐  ┌──────────┐  ┌────────────┐  │   │
│  │  │ Helmet  │  │  CORS    │  │ Rate Limit │  │   │
│  │  └─────────┘  └──────────┘  └────────────┘  │   │
│  │                                               │   │
│  │  ┌─────────────────────────────────────────┐ │   │
│  │  │         API Routes (/api/*)             │ │   │
│  │  │  auth | projects | tasks | dashboard    │ │   │
│  │  └─────────────────────────────────────────┘ │   │
│  │                                               │   │
│  │  ┌─────────────────────────────────────────┐ │   │
│  │  │    Static Files (React SPA)             │ │   │
│  │  │    /client/dist → index.html            │ │   │
│  │  └─────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────┘   │
│                         │                            │
└─────────────────────────┼────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   MongoDB Atlas       │
              │   (Cloud Database)    │
              └───────────────────────┘
```

---

## Production Optimizations Applied

| Feature | Implementation |
|---------|---------------|
| **Secure Headers** | Helmet.js (XSS, clickjacking, MIME sniffing) |
| **Compression** | Gzip all responses (60-70% size reduction) |
| **Rate Limiting** | 100 req/15min (API), 20 req/15min (auth) |
| **Static Caching** | 1-year cache headers on built assets |
| **Code Splitting** | 19 lazy-loaded chunks |
| **Trust Proxy** | Enabled for Railway reverse proxy |
| **Error Logging** | Morgan combined format in production |
| **DB Indexes** | Compound indexes on frequent queries |
| **JWT Expiry** | Configurable token lifetime |
| **Password Security** | bcrypt with 12 salt rounds |

---

## Troubleshooting

### App won't start
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Database connection fails
- Verify MONGODB_URI is correct
- Check username/password in the URI
- Ensure database name is appended (`/team-task-manager`)

### Frontend shows blank page
- Check if build completed (look for `client/dist` in logs)
- Verify `NODE_ENV=production` is set

### 401 Unauthorized errors
- JWT_SECRET must match between token generation and verification
- Check token hasn't expired

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `PORT` | ✅ | 5000 | Server port (Railway sets this automatically) |
| `NODE_ENV` | ✅ | development | Set to `production` for deployment |
| `MONGODB_URI` | ✅ | — | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | — | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | ❌ | 7d | Token expiration duration |

---

## Custom Domain (Optional)

1. In Railway: Settings → Networking → Custom Domain
2. Add your domain (e.g., `tasks.yourdomain.com`)
3. Add CNAME record in your DNS: point to Railway's domain
4. Wait for SSL certificate (automatic via Let's Encrypt)
