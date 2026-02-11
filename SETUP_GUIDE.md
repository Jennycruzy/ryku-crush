# Ryku Crush Game - Complete Setup Guide

This guide will walk you through setting up both the frontend and backend of the Ryku Crush game.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Connecting Frontend to Backend](#connecting-frontend-to-backend)
6. [Adding Assets](#adding-assets)
7. [Testing](#testing)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm**, **pnpm**, or **yarn** package manager
- **MongoDB** (v5 or higher) - [Installation Guide](#mongodb-installation)
- **Git** (optional, for version control)

### MongoDB Installation

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Windows
Download and install from: https://www.mongodb.com/try/download/community

---

## Quick Start

### 1. Extract the Project
```bash
# If you have a ZIP file
unzip ryku-crush-game.zip
cd ryku-crush-game
```

### 2. Install Frontend Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Set Up Environment Variables

**Backend** (`backend/.env`):
```bash
cd backend
cp .env.example .env
# Edit .env and update JWT_SECRET to a secure random string
cd ..
```

**Frontend** (`.env.local`):
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

### 5. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows - MongoDB should start automatically, or use MongoDB Compass
```

### 6. Start Backend Server
```bash
cd backend
npm run dev
```

Backend should now be running on http://localhost:5000

### 7. Start Frontend (in a new terminal)
```bash
# From project root
npm run dev
```

Frontend should now be running on http://localhost:3000

### 8. Open the Game
Visit http://localhost:3000 in your browser and start playing!

---

## Frontend Setup

### Directory Structure
```
frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── game-board.tsx
│   ├── game-header.tsx
│   ├── game-over-screen.tsx
│   ├── game-start-screen.tsx
│   └── ryku-crush-game.tsx
├── lib/
│   ├── game-data.ts
│   └── sounds.ts
├── public/
│   ├── images/
│   └── sounds/
├── package.json
└── README.md
```

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

---

## Backend Setup

### Directory Structure
```
backend/
├── server.js
├── package.json
├── .env.example
├── .env (create this)
└── README.md
```

### Installation Steps

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ryku-crush
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

   ⚠️ **IMPORTANT**: Change `JWT_SECRET` to a secure random string!

4. **Start the Server**

   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

5. **Verify Server is Running**
   ```bash
   curl http://localhost:5000/api/health
   ```

   Should return:
   ```json
   {"status":"OK","message":"Server is running"}
   ```

---

## Connecting Frontend to Backend

### Step 1: Create API Service

Create `lib/api.ts` in the frontend:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function register(username: string, password: string, profilePicture?: string) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, profilePicture })
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function submitScore(token: string, score: number, crushed: number) {
  const response = await fetch(`${API_URL}/api/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ score, crushed })
  });
  if (!response.ok) throw new Error('Score submission failed');
  return response.json();
}

export async function getWeeklyLeaderboard(limit = 100) {
  const response = await fetch(`${API_URL}/api/leaderboard/weekly?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
}

export async function getMyWeeklyScore(token: string) {
  const response = await fetch(`${API_URL}/api/scores/my-week`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch score');
  return response.json();
}
```

### Step 2: Add Authentication Context

Create `lib/auth-context.tsx`:

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  profilePicture: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, profilePicture?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const register = async (username: string, password: string, profilePicture?: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, profilePicture })
    });
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### Step 3: Wrap App with Auth Provider

Update `app/layout.tsx`:
```typescript
import { AuthProvider } from '@/lib/auth-context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## Adding Assets

### Profile Images

Add these images to `/public/images/`:

✅ **Required Images:**
- `raiku-logo.jpg`
- `rykuan-mascot.jpg`
- `solana-logo.jpg`
- `ethereum-logo.jpg`
- `cone-guy.jpg`
- `pineapple-feet.jpg`
- `ninja-guy.jpg`
- `frog-hoodie.jpg`
- `mic-blue.png`
- `gibby.jpg` ⭐ NEW
- `ostone.jpg` ⭐ NEW
- `octopus-girl-new.jpg` ⭐ UPDATED

### Sound Files

Add these MP3 files to `/public/sounds/`:

✅ **Required Sounds:**
- `click.mp3` - Avatar click sound
- `bomb.mp3` - Explosion/penalty sound
- `great-chad.mp3` - Victory sound (≥10,000 pts)
- `keep-it-up.mp3` - Handclap sound (5,000-9,999 pts)
- `try-harder.mp3` - Fail sound (3,000-4,999 pts)

**Where to get free sounds:**
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)
- [Mixkit.co](https://mixkit.co/free-sound-effects/)

See `/public/sounds/README.md` for detailed sound recommendations.

---

## Testing

### Test Frontend Only (Without Backend)
```bash
npm run dev
```
- The game will work
- Scores won't be saved
- No authentication/leaderboard

### Test Backend API

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Get leaderboard
curl http://localhost:5000/api/leaderboard/weekly
```

### Test Full Integration

1. Start both frontend and backend
2. Open http://localhost:3000
3. Click "Play Now"
4. Play a game
5. Check if score appears in leaderboard

---

## Production Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

Set environment variable:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (Heroku/Railway/DigitalOcean)

1. **Set environment variables:**
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ryku-crush
   JWT_SECRET=super-secret-production-key-min-32-chars
   FRONTEND_URL=https://your-frontend-url.com
   NODE_ENV=production
   ```

2. **Deploy:**
   ```bash
   # Heroku
   git push heroku main

   # Railway
   railway up

   # Or build Docker image
   docker build -t ryku-crush-backend .
   ```

### Database (MongoDB Atlas)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

---

## Troubleshooting

### Frontend Issues

**Images not loading:**
- Check all images are in `/public/images/`
- Verify file names match exactly (case-sensitive)
- Check browser console for errors

**Sounds not playing:**
- Ensure files are in `/public/sounds/`
- Check browser allows autoplay
- Try clicking sound toggle ON

**Game too fast/slow:**
- Edit `components/game-board.tsx`
- Adjust `GAME_TIME`, `getSpeedMultiplier()`, `getSpawnInterval()`

### Backend Issues

**MongoDB connection failed:**
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Try connecting manually
mongosh
```

**Port 5000 already in use:**
```bash
# Kill process
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

**JWT token invalid:**
- Check `JWT_SECRET` matches
- Token expires after 30 days
- Clear localStorage and login again

### Integration Issues

**CORS errors:**
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL
- Check browser console for specific CORS error

**API calls failing:**
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify network tab in browser dev tools

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README files in `/backend` and root directory
3. Check browser console and server logs for errors

---

## License

MIT

---

**Made with ❤️ by jennycruzy**
