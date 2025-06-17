# 🌃 MemeHustle: Cyberpunk AI Meme Marketplace

> **HACK THE PLANET! 💀** - A MERN stack cyberpunk meme marketplace where AI meets chaos and neon vibes collide.

[![Cyberpunk](https://img.shields.io/badge/Vibe-Cyberpunk-ff00ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjZmYwMGZmIi8+Cjwvc3ZnPgo=)]()
[![Status](https://img.shields.io/badge/Status-Hacking%20Reality-00ffff?style=for-the-badge)]()
[![AI](https://img.shields.io/badge/AI-Gemini%20Powered-00ff00?style=for-the-badge)]()

## 🔥 Features - Hack the Matrix

### 🎨 **Meme Creation**
- Create memes with title, image URL, and tags
- Auto-generated placeholder images if none provided
- Real-time AI caption generation via Google Gemini
- Cyberpunk vibes analysis for each meme

### 💎 **Real-Time Bidding**
- Bid on memes with fake credits
- Live WebSocket updates across all connected users
- Highest bid tracking with bidder identification
- Mock user system for hackathon vibes

### ⚡ **Upvote/Downvote System**
- Vote on memes with real-time updates
- Trending leaderboard based on upvotes
- Live vote broadcasting via Socket.IO
- Cached leaderboard for performance

### 🤖 **AI Integration (Google Gemini)**
- Generate funny cyberpunk-style captions
- AI-powered vibe analysis (e.g., "Neon Crypto Chaos")
- In-memory caching for AI responses
- Fallback system if AI fails

### 🌃 **Cyberpunk UI**
- Neon-soaked design with glitch effects
- Terminal-style animations and typewriter effects
- Responsive grid layout for memes
- Matrix-inspired background patterns
- Custom cyberpunk color palette

## 🚀 Tech Stack - Neural Link Established

- **Frontend**: React 18 + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express + Socket.IO
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Real-time**: WebSockets for live bidding/voting
- **Deployment**: Vercel/Render ready
- **Styling**: Custom cyberpunk animations & neon themes

## ⚡ Quick Start - Hack Mode Activated

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd memehustle-cyberpunk
npm install
```

### 2. Setup Supabase Database
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL in `server/supabase-setup.sql` in your Supabase SQL editor
4. Get your project URL and anon key

### 3. Setup Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key for Gemini
3. Copy the key for environment setup

### 4. Environment Configuration

Create `server/.env`:
```bash
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini AI API
GEMINI_API_KEY=your-gemini-api-key

# Server Port
PORT=5001
```

### 5. Install Dependencies
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install
```

### 6. Launch the Cyberpunk Chaos
```bash
# From project root - runs both server and client
npm run dev
```

**🌃 Access the app at `http://localhost:3000`**

## 📁 Project Structure - System Architecture

```
memehustle-cyberpunk/
├── server/                 # Express.js backend
│   ├── index.js           # Main server with Socket.IO
│   ├── package.json       # Server dependencies
│   ├── supabase-setup.sql # Database schema
│   └── .env               # Environment variables
├── client/                # React frontend
│   ├── src/
│   │   ├── App.js         # Main React app
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Cyberpunk styles
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json       # Client dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## 🎯 API Endpoints - Neural Interface

### Memes
- `GET /api/memes` - Fetch all memes
- `POST /api/memes` - Create new meme
- `POST /api/memes/:id/vote` - Vote on meme
- `POST /api/memes/:id/bid` - Bid on meme
- `POST /api/memes/:id/caption` - Generate AI caption

### Leaderboard
- `GET /api/leaderboard?top=10` - Get top memes

### Health Check
- `GET /api/health` - Server status

## 🔌 Real-Time Events - WebSocket Chaos

### Client → Server
- `join_room` - Join a specific room

### Server → Client
- `new_meme` - New meme created
- `vote_update` - Vote count updated
- `new_bid` - New bid placed
- `meme_updated` - Meme data updated (AI caption/vibe)

## 🎨 Cyberpunk Design System

### Color Palette
```css
--neon-pink: #ff00ff
--neon-cyan: #00ffff  
--neon-green: #00ff00
--neon-purple: #8b00ff
--cyber-dark: #0a0a0a
--cyber-gray: #1a1a1a
```

### Custom Components
- `neon-button` - Glowing cyberpunk buttons
- `cyber-card` - Glass-morphic cards with neon borders
- `glitch-text` - Animated glitch text effects
- `terminal-text` - Matrix-style terminal text

## 🚀 Deployment - Ship to the Matrix

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client && vercel

# Deploy server
cd ../server && vercel
```

### Render
1. Connect your GitHub repo to Render
2. Create web service for server
3. Create static site for client
4. Set environment variables

## 🤖 AI Integration Details

### Google Gemini Setup
The app uses Google Gemini for:
- **Captions**: Funny, cyberpunk-style meme captions
- **Vibes**: Aesthetic descriptions like "Neon Crypto Chaos"

### Fallback System
If AI fails, the app uses:
- Hardcoded caption fallbacks
- Random vibe generators
- Cached responses for performance

## 🔧 Development Notes - Hackathon Vibes

### Hacky Shortcuts (Intentional)
- Mock user authentication (hardcoded users)
- No input validation (ship fast, break things)
- In-memory caching (simple but works)
- Placeholder images via Lorem Picsum
- Basic error handling

### Real-Time Magic
- Socket.IO for instant updates
- Optimistic UI updates
- Live bid notifications
- Real-time vote counting

## 🎮 Usage Examples

### Create a Meme
```javascript
// POST /api/memes
{
  "title": "Doge HODL",
  "image_url": "https://picsum.photos/400/300",
  "tags": ["crypto", "funny"]
}
```

### Place a Bid
```javascript
// POST /api/memes/:id/bid
{
  "credits": 500
}
```

### Vote on Meme
```javascript
// POST /api/memes/:id/vote
{
  "type": "up" // or "down"
}
```

## 🌟 Cyberpunk Features Showcase

### Visual Effects
- ✨ Glitch text animations
- 🌈 Neon glow effects
- 💫 Hover transformations
- 🔮 Matrix-style background
- ⚡ Terminal typewriter effect

### Interactive Elements
- 🎮 Real-time bidding wars
- 🗳️ Live voting system
- 📊 Dynamic leaderboard
- 🔄 Auto-refreshing data
- 📱 Responsive design

## 🏆 Assignment Completion

### Core Requirements ✅
- [x] Meme Creation with forms
- [x] Real-Time Bidding via WebSockets  
- [x] Upvote/Downvote system
- [x] AI Captions & Vibes (Gemini API)
- [x] Cyberpunk UI with neon aesthetics
- [x] MERN stack implementation
- [x] Supabase database integration
- [x] Responsive design
- [x] Live deployment ready

### Bonus Features ✅
- [x] Terminal typing effects
- [x] Glitch animations
- [x] Matrix background patterns
- [x] Toast notifications
- [x] Loading animations
- [x] Seed data included

## 💀 Vibe Check

**Status**: MAXIMUM CYBERPUNK ENERGY ⚡  
**Deployment**: Ready for the Matrix  
**AI**: Powered by Gemini Chaos  
**Real-time**: Socket.IO Magic  
**Design**: Neon-soaked Perfection  

---

*Built with 💀 in true hackathon spirit. Hack the planet! ⚡*

## 🎬 Demo Commands

```bash
# Start the cyberpunk chaos
npm run dev

# Build for production
npm run build

# Server only
npm run server

# Client only  
npm run client
```

**🚀 Live Demo**: [Deploy your URL here]  
**💻 Repository**: [Your GitHub URL here]  
**🎥 Video Demo**: [Optional demo video]

---

*"In the neon-lit alleys of the internet, memes are the new currency and vibes are the ultimate hack." - Anonymous Cyberpunk* 💀 