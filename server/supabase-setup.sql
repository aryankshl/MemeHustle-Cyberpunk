-- MemeHustle Cyberpunk Database Setup
-- Run this in your Supabase SQL editor

-- Memes table
CREATE TABLE memes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  owner_id TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  highest_bid INTEGER DEFAULT 0,
  highest_bidder TEXT,
  caption TEXT,
  vibe TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids table
CREATE TABLE bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meme_id UUID REFERENCES memes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  credits INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance (hacky but works)
CREATE INDEX idx_memes_upvotes ON memes(upvotes DESC);
CREATE INDEX idx_memes_created ON memes(created_at DESC);
CREATE INDEX idx_memes_tags ON memes USING gin(tags);
CREATE INDEX idx_bids_meme ON bids(meme_id);

-- Insert some seed data for testing
INSERT INTO memes (title, image_url, tags, owner_id, upvotes, caption, vibe) VALUES
('Doge HODL', 'https://picsum.photos/400/300?random=1', '{"crypto", "funny"}', 'cyberpunk420', 69, 'Much HODL, very stonks! 🚀', 'Neon Crypto Chaos'),
('Matrix Cat', 'https://picsum.photos/400/300?random=2', '{"cat", "matrix"}', 'neo_hacker', 42, 'I can haz red pill? 💊', 'Digital Rebellion'),
('Stonks Only Go Up', 'https://picsum.photos/400/300?random=3', '{"stonks", "moon"}', 'matrix_breaker', 128, 'Brrr goes the printer 📈', 'Retro Finance Vibes'),
('Glitch Pepe', 'https://picsum.photos/400/300?random=4', '{"pepe", "glitch"}', 'neon_samurai', 84, 'Feels glitchy man... ⚡', 'Hack Energy'),
('Cyber Shiba', 'https://picsum.photos/400/300?random=5', '{"shiba", "cyberpunk"}', 'ghost_in_shell', 156, 'Such cyber, very punk! 🌃', 'Matrix Vibes');

-- RLS (Row Level Security) - disabled for hackathon speed
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (hacky but works for demo)
CREATE POLICY "Allow all for memes" ON memes FOR ALL USING (true);
CREATE POLICY "Allow all for bids" ON bids FOR ALL USING (true); 