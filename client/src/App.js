import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Heart, 
  HeartOff, 
  Sparkles,
  Terminal,
  Cpu
} from 'lucide-react';
import './index.css';

// Socket connection
const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5001');

// API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Terminal messages constant
const terminalMessages = [
  'ACCESSING MEME DATABASE...',
  'NEURAL LINK ESTABLISHED',
  'HACK THE PLANET! 💀',
  'LOADING CYBERPUNK VIBES...',
  'MEMEHUSTLE.EXE RUNNING'
];

function App() {
  const [memes, setMemes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gallery');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Terminal effect state
  const [terminalText, setTerminalText] = useState('');

  // Fetch memes
  const fetchMemes = async () => {
    try {
      const response = await fetch(`${API_BASE}/memes`);
      const data = await response.json();
      setMemes(data);
    } catch (error) {
      console.error('Failed to fetch memes:', error);
      toast.error('Failed to load memes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/leaderboard?top=10`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  // Handle voting
  const handleVote = async (memeId, type) => {
    try {
      const response = await fetch(`${API_BASE}/memes/${memeId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      
      if (response.ok) {
        toast.success(`${type === 'up' ? '⬆️' : '⬇️'} Vote cast!`, {
          style: {
            background: '#1a1a1a',
            color: '#00ffff',
            border: '1px solid #00ffff'
          }
        });
      }
    } catch (error) {
      console.error('Vote failed:', error);
      toast.error('Vote failed');
    }
  };

  // Handle bidding
  const handleBid = async (memeId, credits) => {
    try {
      const response = await fetch(`${API_BASE}/memes/${memeId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: parseInt(credits) })
      });
      
      if (response.ok) {
        toast.success(`💎 Bid placed: ${credits} credits!`, {
          style: {
            background: '#1a1a1a',
            color: '#ff00ff',
            border: '1px solid #ff00ff'
          }
        });
      }
    } catch (error) {
      console.error('Bid failed:', error);
      toast.error('Bid failed');
    }
  };

  // Terminal effect
  useEffect(() => {
    let currentIndex = 0;
    let currentText = '';
    let messageIndex = 0;
    
    const typeWriter = () => {
      const currentMessage = terminalMessages[messageIndex];
      
      if (currentIndex < currentMessage.length) {
        currentText += currentMessage.charAt(currentIndex);
        setTerminalText(currentText + '_');
        currentIndex++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          currentText = '';
          currentIndex = 0;
          messageIndex = (messageIndex + 1) % terminalMessages.length;
          setTerminalText('');
        }, 2000);
      }
    };

    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Socket event listeners
  useEffect(() => {
    socket.on('new_meme', (meme) => {
      setMemes(prev => [meme, ...prev]);
      toast('🚀 New meme just dropped!', {
        style: {
          background: '#1a1a1a',
          color: '#00ff00',
          border: '1px solid #00ff00'
        }
      });
    });

    socket.on('vote_update', ({ meme_id, type, newValue }) => {
      setMemes(prev => prev.map(meme => 
        meme.id === meme_id 
          ? { ...meme, [type === 'up' ? 'upvotes' : 'downvotes']: newValue }
          : meme
      ));
    });

    socket.on('new_bid', ({ meme_id, credits, user_id }) => {
      setMemes(prev => prev.map(meme => 
        meme.id === meme_id 
          ? { ...meme, highest_bid: credits, highest_bidder: user_id }
          : meme
      ));
      
      toast(`💰 New bid: ${credits} credits by ${user_id}`, {
        style: {
          background: '#1a1a1a',
          color: '#ffff00',
          border: '1px solid #ffff00'
        }
      });
    });

    socket.on('meme_updated', (updatedMeme) => {
      setMemes(prev => prev.map(meme => 
        meme.id === updatedMeme.id ? { ...meme, ...updatedMeme } : meme
      ));
    });

    return () => {
      socket.off('new_meme');
      socket.off('vote_update');
      socket.off('new_bid');
      socket.off('meme_updated');
    };
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchMemes();
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark matrix-bg flex items-center justify-center">
        <div className="text-center">
          <div className="cyber-spinner w-16 h-16 mx-auto mb-4"></div>
          <div className="terminal-text text-xl">
            {terminalText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark matrix-bg">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-cyber-gray/80 backdrop-blur-md border-b border-neon-cyan/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Cpu className="w-8 h-8 text-neon-cyan animate-pulse" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-pink to-neon-cyan bg-clip-text text-transparent">
                MemeHustle
              </h1>
              <div className="hidden md:block">
                <span className="terminal-text text-sm">
                  {terminalText}
                </span>
              </div>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 font-cyber text-sm transition-all ${
                  activeTab === 'gallery' 
                    ? 'text-neon-cyan border-b-2 border-neon-cyan' 
                    : 'text-gray-400 hover:text-neon-cyan'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                GALLERY
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 font-cyber text-sm transition-all ${
                  activeTab === 'leaderboard' 
                    ? 'text-neon-pink border-b-2 border-neon-pink' 
                    : 'text-gray-400 hover:text-neon-pink'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                LEADERBOARD
              </button>
            </nav>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="neon-button"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              HACK NEW MEME
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Create Meme Form */}
        {showCreateForm && <CreateMemeForm onClose={() => setShowCreateForm(false)} />}
        
        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memes.map(meme => (
              <MemeCard 
                key={meme.id} 
                meme={meme} 
                onVote={handleVote}
                onBid={handleBid}
              />
            ))}
          </div>
        )}
        
        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="max-w-4xl mx-auto">
            <div className="cyber-card">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-neon-pink mr-3" />
                <h2 className="text-2xl font-bold text-neon-pink">
                  TOP MEMES
                </h2>
              </div>
              
              <div className="space-y-4">
                {leaderboard.map((meme, index) => (
                  <div key={meme.id} className="flex items-center p-4 bg-cyber-light/50 rounded-lg border border-neon-cyan/10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-cyber-gray text-neon-cyan'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <img
                      src={meme.image_url}
                      alt={meme.title}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-neon-cyan">{meme.title}</h3>
                      <p className="text-sm text-gray-400">{meme.caption}</p>
                      <div className="text-xs text-neon-purple mt-1">{meme.vibe}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-neon-green">
                        {meme.upvotes} ⬆️
                      </div>
                      <div className="text-sm text-neon-pink">
                        {meme.highest_bid || 0} 💎
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Meme Card Component
function MemeCard({ meme, onVote, onBid }) {
  const [bidAmount, setBidAmount] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (bidAmount && parseInt(bidAmount) > 0) {
      onBid(meme.id, bidAmount);
      setBidAmount('');
      setShowBidForm(false);
    }
  };

  return (
    <div className="cyber-card hover:border-neon-cyan/40 transition-all duration-300 transform hover:scale-105 group">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Vibe badge */}
        {meme.vibe && (
          <div className="absolute top-2 right-2 bg-neon-purple/20 backdrop-blur-sm border border-neon-purple/50 rounded-full px-2 py-1 text-xs text-neon-purple">
            {meme.vibe}
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-neon-cyan mb-1 glitch-text" data-text={meme.title}>
            {meme.title}
          </h3>
          {meme.caption && (
            <p className="text-sm text-neon-green font-matrix">
              "{meme.caption}"
            </p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {meme.tags?.map(tag => (
              <span key={tag} className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded-full border border-neon-cyan/20">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex space-x-4">
            <span className="text-neon-green">⬆️ {meme.upvotes || 0}</span>
            <span className="text-red-400">⬇️ {meme.downvotes || 0}</span>
          </div>
          <div className="text-neon-pink">
            💎 {meme.highest_bid || 0} credits
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onVote(meme.id, 'up')}
            className="flex-1 py-2 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 rounded text-neon-green text-sm font-cyber transition-all"
          >
            <Heart className="w-4 h-4 inline mr-1" />
            UPVOTE
          </button>
          
          <button
            onClick={() => onVote(meme.id, 'down')}
            className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 text-sm font-cyber transition-all"
          >
            <HeartOff className="w-4 h-4 inline mr-1" />
            DOWNVOTE
          </button>
        </div>
        
        {/* Bid Section */}
        <div className="border-t border-neon-cyan/20 pt-3">
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full neon-button-pink text-sm py-2"
            >
              <DollarSign className="w-4 h-4 inline mr-1" />
              PLACE BID
            </button>
          ) : (
            <form onSubmit={handleBidSubmit} className="space-y-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter credits..."
                min="1"
                className="w-full p-2 bg-cyber-gray border border-neon-cyan/30 rounded text-neon-cyan placeholder-gray-500 font-cyber text-sm focus:border-neon-cyan focus:outline-none"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-1 bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/50 rounded text-neon-pink text-xs font-cyber transition-all"
                >
                  BID
                </button>
                <button
                  type="button"
                  onClick={() => setShowBidForm(false)}
                  className="flex-1 py-1 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-600/50 rounded text-gray-400 text-xs font-cyber transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Owner */}
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>by {meme.owner_id}</span>
          {meme.highest_bidder && (
            <span className="text-neon-pink">
              💎 {meme.highest_bidder}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Create Meme Form Component
function CreateMemeForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const response = await fetch(`${API_BASE}/memes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags
        })
      });
      
      if (response.ok) {
        toast.success('🚀 Meme deployed to the matrix!', {
          style: {
            background: '#1a1a1a',
            color: '#00ff00',
            border: '1px solid #00ff00'
          }
        });
        onClose();
      }
    } catch (error) {
      console.error('Failed to create meme:', error);
      toast.error('Meme upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="cyber-card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neon-cyan flex items-center">
            <Terminal className="w-5 h-5 mr-2" />
            DEPLOY NEW MEME
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-neon-pink transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-cyber text-neon-cyan mb-2">
              MEME TITLE
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Doge HODL"
              required
              className="w-full p-3 bg-cyber-gray border border-neon-cyan/30 rounded text-neon-cyan placeholder-gray-500 font-cyber focus:border-neon-cyan focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-cyber text-neon-cyan mb-2">
              IMAGE URL (OPTIONAL)
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              placeholder="https://picsum.photos/400/300"
              className="w-full p-3 bg-cyber-gray border border-neon-cyan/30 rounded text-neon-cyan placeholder-gray-500 font-cyber focus:border-neon-cyan focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generated image</p>
          </div>
          
          <div>
            <label className="block text-sm font-cyber text-neon-cyan mb-2">
              TAGS (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="crypto, funny, stonks"
              className="w-full p-3 bg-cyber-gray border border-neon-cyan/30 rounded text-neon-cyan placeholder-gray-500 font-cyber focus:border-neon-cyan focus:outline-none"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 neon-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="cyber-spinner w-4 h-4 mr-2"></div>
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {loading ? 'UPLOADING...' : 'DEPLOY MEME'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 bg-transparent text-gray-400 hover:text-white hover:border-gray-400 transition-all font-cyber uppercase"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App; 