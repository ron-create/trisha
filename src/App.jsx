import React from 'react';
import { FaHeart, FaCloud, FaKissWinkHeart } from "react-icons/fa";
import './App.css';

function App() {
  const movies = [
    { title: "🎬 Clueless", desc: "romcom cute faves", url: "https://cineb.gg/watch-movie/watch-clueless-free-17414.5301523" },
    { title: "🎬 Weapons", desc: "horror faves", url: "https://cineb.gg/watch-movie/watch-weapons-free-129655.12506863" },
    { title: "🎬 About Time", desc: "if u want this", url: "https://cineb.gg/watch-movie/watch-about-time-free-19112.5298427" },
    { title: "🎬 Crazy Rich Asians", desc: "cute romcom", url: "https://cineb.gg/watch-movie/watch-crazy-rich-asians-free-19696.5349043" },
    { title: "🎬 Gone Girl", desc: "go to movies", url: "https://cineb.gg/watch-movie/watch-gone-girl-free-19717.5297395" },
    { title: "🎬 Lady Bird", desc: "go to movies", url: "https://cineb.gg/watch-movie/watch-lady-bird-free-19451.5297842" }
  ];

  return (
    <div className="parent">
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

export default App;