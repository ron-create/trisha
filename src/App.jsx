import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import UploadUpdates from './UploadUpdates';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload-updates" element={<UploadUpdates />} />
      </Routes>
    </Router>
  );
}

export default App;