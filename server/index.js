const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Check if we're in demo mode (no real API keys)
const DEMO_MODE = !process.env.SUPABASE_URL || 
                  process.env.SUPABASE_URL === 'your-supabase-project-url' ||
                  !process.env.GEMINI_API_KEY || 
                  process.env.GEMINI_API_KEY === 'your-gemini-api-key';

console.log(`🚀 Starting MemeHustle in ${DEMO_MODE ? 'DEMO' : 'LIVE'} mode...`);

// Supabase client (only if not in demo mode)
let supabase = null;
if (!DEMO_MODE) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log('✅ Supabase connected');
  } catch (error) {
    console.log('❌ Supabase connection failed, using demo mode');
    supabase = null;
  }
}

// Gemini AI client (only if not in demo mode)
let genAI = null;
if (!DEMO_MODE && process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI connected');
  } catch (error) {
    console.log('❌ Gemini AI connection failed, using fallbacks');
    genAI = null;
  }
}

// In-memory cache for AI responses and leaderboard
const aiCache = new Map();
const leaderboardCache = { data: null, lastUpdate: 0 };

// Mock users for hackathon vibes
const MOCK_USERS = ['cyberpunk420', 'neo_hacker', 'matrix_breaker', 'neon_samurai', 'ghost_in_shell'];

// Fallback captions if AI fails
const FALLBACK_CAPTIONS = [
  "YOLO to the moon! 🚀",
  "HODL the vibes! 💎",
  "Brrr goes stonks 📈",
  "Hack the planet! 💀",
  "Neural link activated ⚡",
  "Glitch in the matrix 🔴",
  "Vibe check: PASSED ✅"
];

// Demo mode mock data
let mockMemes = [
  {
    id: '1',
    title: 'Doge HODL',
    image_url: 'https://picsum.photos/400/300?random=1',
    tags: ['crypto', 'funny'],
    owner_id: 'cyberpunk420',
    upvotes: 69,
    downvotes: 2,
    highest_bid: 420,
    highest_bidder: 'neo_hacker',
    caption: 'Much HODL, very stonks! 🚀',
    vibe: 'Neon Crypto Chaos',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Matrix Cat',
    image_url: 'https://picsum.photos/400/300?random=2',
    tags: ['cat', 'matrix'],
    owner_id: 'neo_hacker',
    upvotes: 42,
    downvotes: 1,
    highest_bid: 300,
    highest_bidder: 'matrix_breaker',
    caption: 'I can haz red pill? 💊',
    vibe: 'Digital Rebellion',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Stonks Only Go Up',
    image_url: 'https://picsum.photos/400/300?random=3',
    tags: ['stonks', 'moon'],
    owner_id: 'matrix_breaker',
    upvotes: 128,
    downvotes: 5,
    highest_bid: 1000,
    highest_bidder: 'cyberpunk420',
    caption: 'Brrr goes the printer 📈',
    vibe: 'Retro Finance Vibes',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Glitch Pepe',
    image_url: 'https://picsum.photos/400/300?random=4',
    tags: ['pepe', 'glitch'],
    owner_id: 'neon_samurai',
    upvotes: 84,
    downvotes: 3,
    highest_bid: 666,
    highest_bidder: 'ghost_in_shell',
    caption: 'Feels glitchy man... ⚡',
    vibe: 'Hack Energy',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Cyber Shiba',
    image_url: 'https://picsum.photos/400/300?random=5',
    tags: ['shiba', 'cyberpunk'],
    owner_id: 'ghost_in_shell',
    upvotes: 156,
    downvotes: 7,
    highest_bid: 777,
    highest_bidder: 'neon_samurai',
    caption: 'Such cyber, very punk! 🌃',
    vibe: 'Matrix Vibes',
    created_at: new Date().toISOString()
  }
];

// Generate random meme placeholder
const getRandomMemeImage = () => {
  const themes = ['cat', 'dog', 'tech', 'space', 'cyberpunk'];
  const theme = themes[Math.floor(Math.random() * themes.length)];
  return `https://picsum.photos/400/300?random=${Date.now()}&${theme}`;
};

// AI Caption Generation
async function generateCaption(tags, title) {
  const cacheKey = `caption_${tags.join('_')}_${title}`;
  
  if (aiCache.has(cacheKey)) {
    return aiCache.get(cacheKey);
  }

  // Use AI if available
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate a funny, cyberpunk-style caption for a meme with title "${title}" and tags: ${tags.join(', ')}. Make it edgy and internet culture. Max 50 characters.`;
      
      const result = await model.generateContent(prompt);
      const caption = result.response.text().trim();
      
      aiCache.set(cacheKey, caption);
      return caption;
    } catch (error) {
      console.log('AI failed, using fallback:', error.message);
    }
  }

  // Fallback caption
  const fallback = FALLBACK_CAPTIONS[Math.floor(Math.random() * FALLBACK_CAPTIONS.length)];
  aiCache.set(cacheKey, fallback);
  return fallback;
}

// AI Vibe Analysis
async function generateVibe(tags, title) {
  const cacheKey = `vibe_${tags.join('_')}_${title}`;
  
  if (aiCache.has(cacheKey)) {
    return aiCache.get(cacheKey);
  }

  // Use AI if available
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Describe the vibe/aesthetic of a meme with title "${title}" and tags: ${tags.join(', ')}. Use cyberpunk language. Examples: "Neon Crypto Chaos", "Retro Stonks Vibes", "Matrix Glitch Energy". Max 25 characters.`;
      
      const result = await model.generateContent(prompt);
      const vibe = result.response.text().trim();
      
      aiCache.set(cacheKey, vibe);
      return vibe;
    } catch (error) {
      console.log('Vibe AI failed, using fallback');
    }
  }

  // Fallback vibe
  const vibes = ["Neon Chaos", "Cyber Stonks", "Matrix Vibes", "Digital Rebellion", "Hack Energy"];
  const fallback = vibes[Math.floor(Math.random() * vibes.length)];
  aiCache.set(cacheKey, fallback);
  return fallback;
}

// API Routes

// Get all memes
app.get('/api/memes', async (req, res) => {
  try {
    if (DEMO_MODE || !supabase) {
      // Return mock data in demo mode
      res.json(mockMemes);
      return;
    }

    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching memes:', error);
    // Fallback to mock data on error
    res.json(mockMemes);
  }
});

// Create new meme
app.post('/api/memes', async (req, res) => {
  try {
    let { title, image_url, tags } = req.body;
    
    // Hacky defaults for speed
    if (!image_url) image_url = getRandomMemeImage();
    if (!tags || tags.length === 0) tags = ['meme', 'crypto'];
    
    const owner_id = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    
    const newMeme = {
      title,
      image_url,
      tags,
      owner_id,
      upvotes: 0,
      downvotes: 0,
      highest_bid: 0,
      highest_bidder: null,
      caption: '',
      vibe: ''
    };

    if (DEMO_MODE || !supabase) {
      // Add to mock data in demo mode
      newMeme.id = Date.now().toString();
      newMeme.created_at = new Date().toISOString();
      mockMemes.unshift(newMeme);
    } else {
      const { data, error } = await supabase
        .from('memes')
        .insert([newMeme])
        .select();

      if (error) throw error;
      newMeme.id = data[0].id;
      newMeme.created_at = data[0].created_at;
    }
    
    // Generate AI caption and vibe async
    generateCaption(tags, title).then(caption => {
      newMeme.caption = caption;
      if (supabase && !DEMO_MODE) {
        supabase.from('memes').update({ caption }).eq('id', newMeme.id);
      } else {
        // Update mock data
        const memeIndex = mockMemes.findIndex(m => m.id === newMeme.id);
        if (memeIndex !== -1) mockMemes[memeIndex].caption = caption;
      }
      io.emit('meme_updated', { ...newMeme, caption });
    });

    generateVibe(tags, title).then(vibe => {
      newMeme.vibe = vibe;
      if (supabase && !DEMO_MODE) {
        supabase.from('memes').update({ vibe }).eq('id', newMeme.id);
      } else {
        // Update mock data
        const memeIndex = mockMemes.findIndex(m => m.id === newMeme.id);
        if (memeIndex !== -1) mockMemes[memeIndex].vibe = vibe;
      }
      io.emit('meme_updated', { ...newMeme, vibe });
    });

    // Broadcast new meme
    io.emit('new_meme', newMeme);
    
    res.json(newMeme);
  } catch (error) {
    console.error('Error creating meme:', error);
    res.status(500).json({ error: 'Failed to create meme' });
  }
});

// Vote on meme
app.post('/api/memes/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'up' or 'down'
    
    const field = type === 'up' ? 'upvotes' : 'downvotes';
    
    if (DEMO_MODE || !supabase) {
      // Update mock data in demo mode
      const meme = mockMemes.find(m => m.id === id);
      if (meme) {
        meme[field] = (meme[field] || 0) + 1;
        io.emit('vote_update', { meme_id: id, type, newValue: meme[field] });
        res.json(meme);
      } else {
        res.status(404).json({ error: 'Meme not found' });
      }
      return;
    }

    const { data, error } = await supabase
      .from('memes')
      .select(field)
      .eq('id', id)
      .single();

    if (error) throw error;

    const newValue = (data[field] || 0) + 1;
    
    const { data: updated, error: updateError } = await supabase
      .from('memes')
      .update({ [field]: newValue })
      .eq('id', id)
      .select();

    if (updateError) throw updateError;

    // Broadcast vote update
    io.emit('vote_update', { meme_id: id, type, newValue });
    
    // Clear leaderboard cache
    leaderboardCache.data = null;
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

// Bid on meme
app.post('/api/memes/:id/bid', async (req, res) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;
    
    const user_id = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    
    if (DEMO_MODE || !supabase) {
      // Update mock data in demo mode
      const meme = mockMemes.find(m => m.id === id);
      if (meme) {
        meme.highest_bid = credits;
        meme.highest_bidder = user_id;
        io.emit('new_bid', { meme_id: id, user_id, credits, meme });
        res.json({ meme_id: id, user_id, credits });
      } else {
        res.status(404).json({ error: 'Meme not found' });
      }
      return;
    }
    
    // Save bid
    const { data: bidData, error: bidError } = await supabase
      .from('bids')
      .insert([{ meme_id: id, user_id, credits }])
      .select();

    if (bidError) throw bidError;

    // Update meme highest bid
    const { data: memeData, error: memeError } = await supabase
      .from('memes')
      .update({ highest_bid: credits, highest_bidder: user_id })
      .eq('id', id)
      .select();

    if (memeError) throw memeError;

    // Broadcast bid update
    io.emit('new_bid', { meme_id: id, user_id, credits, meme: memeData[0] });
    
    res.json(bidData[0]);
  } catch (error) {
    console.error('Error bidding:', error);
    res.status(500).json({ error: 'Failed to bid' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { top = 10 } = req.query;
    
    if (DEMO_MODE || !supabase) {
      // Return sorted mock data in demo mode
      const sortedMemes = [...mockMemes]
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, parseInt(top));
      res.json(sortedMemes);
      return;
    }
    
    // Use cache if recent (30 seconds)
    if (leaderboardCache.data && Date.now() - leaderboardCache.lastUpdate < 30000) {
      return res.json(leaderboardCache.data);
    }
    
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('upvotes', { ascending: false })
      .limit(parseInt(top));

    if (error) throw error;
    
    // Update cache
    leaderboardCache.data = data;
    leaderboardCache.lastUpdate = Date.now();
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Fallback to mock data
    const sortedMemes = [...mockMemes]
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, parseInt(req.query.top || 10));
    res.json(sortedMemes);
  }
});

// Generate caption manually
app.post('/api/memes/:id/caption', async (req, res) => {
  try {
    const { id } = req.params;
    
    let meme;
    if (DEMO_MODE || !supabase) {
      meme = mockMemes.find(m => m.id === id);
      if (!meme) {
        return res.status(404).json({ error: 'Meme not found' });
      }
    } else {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      meme = data;
    }

    const caption = await generateCaption(meme.tags, meme.title);
    
    if (DEMO_MODE || !supabase) {
      meme.caption = caption;
    } else {
      await supabase
        .from('memes')
        .update({ caption })
        .eq('id', id);
    }

    io.emit('meme_updated', { ...meme, caption });
    
    res.json({ caption });
  } catch (error) {
    console.error('Error generating caption:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('🔌 Cyber hacker connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('💀 Hacker disconnected:', socket.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'HACK THE PLANET! 💀',
    mode: DEMO_MODE ? 'DEMO MODE' : 'LIVE MODE',
    timestamp: new Date().toISOString(),
    vibes: 'Maximum Cyberpunk Energy ⚡',
    supabase: supabase ? 'Connected' : 'Demo Mode',
    gemini: genAI ? 'Connected' : 'Fallback Mode'
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`
🔥 MEMEHUSTLE SERVER ONLINE 🔥
⚡ Port: ${PORT}
🌃 Mode: ${DEMO_MODE ? 'DEMO MODE (Mock Data)' : 'LIVE MODE'}
💀 Status: Hacking the Matrix...
🚀 Supabase: ${supabase ? 'Connected' : 'Demo Mode'}
🤖 Gemini AI: ${genAI ? 'Connected' : 'Fallback Mode'}
  `);
}); 