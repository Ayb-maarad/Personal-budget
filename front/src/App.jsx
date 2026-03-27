import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import EnvelopePage from './pages/EnvelopePage';
import Analytics03 from './components/enterprise-infrastructure-monitor';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<EnvelopePage />} />
        <Route path="/envelopes" element={<EnvelopePage />} />
        <Route path='/exemple' element={<Analytics03/>}/>
      </Routes>
    </div>
  );
}

export default App;
