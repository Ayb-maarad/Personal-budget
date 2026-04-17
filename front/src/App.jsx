import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import EnvelopePage from './pages/EnvelopePage';
import Login from './pages/login';
import Register from './pages/register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/envelopes" element={
          <ProtectedRoute>
            <EnvelopePage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
