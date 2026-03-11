import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TicTacToe from './components/Games/TicTacToe';
import RockPaperScissors from './components/Games/RockPaperScissors';
import SlidingPuzzle from './components/Games/SlidingPuzzle';
import About from './components/Info/About';
import PrivacyPolicy from './components/Info/PrivacyPolicy';
import TermsOfService from './components/Info/TermsOfService';
import NumberGuessingGame from './components/Games/NumberGuessingGame';
import Sudoku from './components/Games/Sudoku';
import MemoryCardGame from './components/Games/MemoryCardGame';
import SnakeGame from "./components/Games/SnakeGame";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
            <Route path="/games/sliding-puzzle" element={<SlidingPuzzle />} />
            <Route path="/games/sudoku" element={<Sudoku />} />
            <Route
              path="/games/number-guessing"
              element={<NumberGuessingGame />}
            />
            <Route path="/games/snake" element={<SnakeGame />} />
            <Route path="/games/memory-card" element={<MemoryCardGame />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;