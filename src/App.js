import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AIPage from './pages/AIPage';
import EMIPage from './pages/EMIPage';

function App() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <h1 className="text-2xl font-bold p-4 border-b border-gray-700">AI Portal</h1>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li><Link className="hover:text-yellow-400" to="/">AI Calling Agent</Link></li>
            <li><Link className="hover:text-yellow-400" to="/emi">EMI Reminder</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<AIPage />} />
          <Route path="/emi" element={<EMIPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;