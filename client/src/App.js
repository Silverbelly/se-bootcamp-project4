import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

// import './App.css';

function App() {
  const [user, setUser] = useState({ id: -1 });

  return (
    <Routes>
      <Route index element={<Login user={user} setUser={setUser} />} />
      <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />
    </Routes>
  );
}

export default App;
