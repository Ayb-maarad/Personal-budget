import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import EnvelopePage from './pages/EnvelopePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<EnvelopePage />} />
        <Route path="/envelopes" element={<EnvelopePage />} />
      </Routes>
    </div>
  );
}

export default App;
