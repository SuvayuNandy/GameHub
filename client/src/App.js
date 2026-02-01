import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TicTacToe from './components/Games/TicTacToe';
import RockPaperScissors from './components/Games/RockPaperScissors';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;