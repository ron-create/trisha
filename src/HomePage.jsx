import React, { useState, useEffect, useRef } from 'react';
import { FaHeart, FaCloud, FaKissWinkHeart, FaBell } from "react-icons/fa";
import { fetchUpdates } from './utils';

function HomePage() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevUpdateCount, setPrevUpdateCount] = useState(0);
  const [notifPermission, setNotifPermission] = useState('default');
  const audioRef = useRef(null);

  const movies = [
    { title: "🎬 Clueless", desc: "romcom cute faves", url: "https://cineb.gg/watch-movie/watch-clueless-free-17414.5301523" },
    { title: "🎬 Weapons", desc: "horror faves", url: "https://cineb.gg/watch-movie/watch-weapons-free-129655.12506863" },
    { title: "🎬 About Time", desc: "if u want this", url: "https://cineb.gg/watch-movie/watch-about-time-free-19112.5298427" },
    { title: "🎬 Crazy Rich Asians", desc: "cute romcom", url: "https://cineb.gg/watch-movie/watch-crazy-rich-asians-free-19696.5349043" },
    { title: "🎬 Gone Girl", desc: "go to movies", url: "https://cineb.gg/watch-movie/watch-gone-girl-free-19717.5297395" },
    { title: "🎬 Lady Bird", desc: "go to movies", url: "https://cineb.gg/watch-movie/watch-lady-bird-free-19451.5297842" }
  ];

  useEffect(() => {
    // Check notification permission on load
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }

    loadUpdates();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      loadUpdates();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadUpdates = async () => {
    try {
      const data = await fetchUpdates();
      const newData = data || [];
      
      // Check if there's a new update
      if (prevUpdateCount > 0 && newData.length > prevUpdateCount) {
        const latestUpdate = newData[0];
        showNotification(latestUpdate);
        playNotificationSound();
      }
      
      setUpdates(newData);
      setPrevUpdateCount(newData.length);
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotifPermission(permission);
        
        if (permission === 'granted') {
          // Test audio immediately with user gesture
          if (audioRef.current) {
            try {
              await audioRef.current.play();
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              console.log('Audio enabled successfully!');
            } catch (err) {
              console.log('Audio setup failed:', err);
            }
          }
        }
      } catch (error) {
        console.error('Notification permission error:', error);
      }
    }
  };

  const showNotification = (update) => {
    if (notifPermission === 'granted') {
      const notification = new Notification('New update from Ron! 💕', {
        body: update.caption || 'Check out the new update!',
        icon: update.media_type === 'image' ? update.media_url : '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'update-notification',
        requireInteraction: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current && notifPermission === 'granted') {
      // Reset audio to start
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => console.log('Notification sound played!'))
        .catch(err => console.log('Audio play failed:', err));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="parent">
      {/* Notification Sound */}
      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
        preload="auto"
      />

      <div className="div1">
        <h2 className="message-title">Hi Bee 💕</h2>
        <p className="message-body">
          Since I'm not around, here are a few things you can do:
        </p>
        <ul className="task-list">
          <li>🌸 Watch your favorite K-drama</li>
          <li>🍓 Drink water and eat something you love, I'll send 200</li>
          <li>🌷 Take a nap if you're tired</li>
          <li>💌 And don't forget — I miss you</li>
        </ul>
      </div>

      <div className="div4 side-box">
        <h3>💗 Bee's Corner</h3>
        <p>My updates baby girl on what I am doing!!!</p>
        
        {notifPermission !== 'granted' && (
          <button onClick={requestNotificationPermission} className="enable-notif-btn">
            <FaBell /> Enable Notifications
          </button>
        )}
        
        {notifPermission === 'granted' && (
          <div className="notif-enabled">
            ✅ Notifications enabled
          </div>
        )}
        
        <div className="updates-feed">
          <h4>Updates from Ron</h4>
          <div className="feed-container">
            {loading ? (
              <div className="feed-placeholder">
                <span>⏳</span>
                <p>Loading updates...</p>
              </div>
            ) : updates.length === 0 ? (
              <div className="feed-placeholder">
                <span>💕</span>
                <p>No updates yet!</p>
              </div>
            ) : (
              updates.map((update) => (
                <div key={update.id} className="feed-item">
                  <div className="feed-content">
                    {update.media_type === 'image' && (
                      <img 
                        src={update.media_url} 
                        alt="Update" 
                        className="feed-media" 
                        loading="lazy"
                      />
                    )}
                    {update.media_type === 'video' && (
                      <video 
                        src={update.media_url} 
                        controls 
                        className="feed-media"
                        preload="metadata"
                      />
                    )}
                    {update.media_type === 'voice' && (
                      <div className="voice-message">
                        <audio 
                          src={update.media_url} 
                          controls 
                          className="feed-audio"
                        />
                      </div>
                    )}
                    {update.caption && (
                      <p className="feed-caption">{update.caption}</p>
                    )}
                  </div>
                  <div className="feed-footer">
                    <span className="feed-timestamp">{formatDate(update.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <FaKissWinkHeart className="cute-icon" />
      </div>

      <div className="div6 note-box">
        <p>Don't stress too much, okay? You're doing great, and I'm proud of you! You can relax baby.</p>
        <div className="movie-section">
          <h4>You can rewatch these movies:</h4>
          <div className="movie-grid">
            {movies.map((movie, index) => (
              <a 
                key={index} 
                href={movie.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="movie-placeholder"
              >
                <div className="movie-title">{movie.title}</div>
                <div className="movie-desc">{movie.desc}</div>
              </a>
            ))}
          </div>
        </div>
        <FaHeart className="cute-icon" />
      </div>

      <div className="div5">
        <div className="floating-cloud">
          <FaCloud className="cloud-icon" />
          <span className="love-message">
            I LOVE YOU SO MUCH, TRISHA NOELLE SUMAWAY 💖
          </span>
        </div>

        <div className="floating-cloud delay-1">
          <FaCloud className="cloud-icon" />
          <span className="love-message">
            You're my favorite kind of forever ☁️
          </span>
        </div>

        <div className="floating-cloud delay-2">
          <FaCloud className="cloud-icon" />
          <span className="love-message">
            Sending hugs from afar 💞
          </span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;