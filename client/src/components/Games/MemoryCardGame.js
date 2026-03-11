import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MemoryCardGame.css';

// ── Card symbol sets per difficulty ──────────────────────────────────────────
const CARD_SETS = {
  easy: ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐'],
  medium: ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🥝', '🍑'],
  hard: ['🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🥝', '🍑', '🍒', '🍍', '🥭', '🍌'],
};

const GRID_COLS = { easy: 3, medium: 4, hard: 6 };
const FLIP_DELAY_MS = 900;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(symbols) {
  return shuffle(
    [...symbols, ...symbols].map((symbol, idx) => ({
      id: idx,
      symbol,
      flipped: false,
      matched: false,
    }))
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
const Card = React.memo(({ card, onClick, disabled }) => {
  const isVisible = card.flipped || card.matched;

  return (
    <motion.div
      className={`mcg-card ${card.matched ? 'mcg-card--matched' : ''} ${disabled && !isVisible ? 'mcg-card--disabled' : ''}`}
      onClick={() => !disabled && !card.matched && !card.flipped && onClick(card.id)}
      whileHover={!isVisible && !disabled ? { scale: 1.06, y: -4 } : {}}
      whileTap={!isVisible && !disabled ? { scale: 0.96 } : {}}
      layout
    >
      <motion.div
        className="mcg-card-inner"
        animate={{ rotateY: isVisible ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back face */}
        <div className="mcg-card-face mcg-card-back">
          <span className="mcg-card-back-icon">❓</span>
        </div>
        {/* Front face */}
        <div className="mcg-card-face mcg-card-front">
          <span className="mcg-symbol">{card.symbol}</span>
        </div>
      </motion.div>

      {card.matched && (
        <motion.div
          className="mcg-match-shimmer"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: 1 }}
        />
      )}
    </motion.div>
  );
});

// ── Main component ────────────────────────────────────────────────────────────
const MemoryCardGame = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [deck, setDeck] = useState(() => buildDeck(CARD_SETS.easy));
  const [, setFlipped] = useState([]);  // ids of face-up cards (max 2)
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [bestScores, setBestScores] = useState({ easy: null, medium: null, hard: null });
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  // ── Win detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const totalPairs = CARD_SETS[difficulty].length;
    if (matches === totalPairs && matches > 0) {
      setRunning(false);
      setGameWon(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      setBestScores((prev) => {
        const prev_score = prev[difficulty];
        const new_score = { moves, time };
        if (
          !prev_score ||
          moves < prev_score.moves ||
          (moves === prev_score.moves && time < prev_score.time)
        ) {
          return { ...prev, [difficulty]: new_score };
        }
        return prev;
      });
    }
  }, [matches, difficulty, moves, time]);

  // ── Card click handler ───────────────────────────────────────────────────
  const handleCardClick = useCallback(
    (id) => {
      if (locked) return;
      if (!running && !gameWon) setRunning(true);

      setFlipped((prev) => {
        const next = [...prev, id];

        // Flip first card
        if (next.length === 1) {
          setDeck((d) =>
            d.map((c) => (c.id === id ? { ...c, flipped: true } : c))
          );
          return next;
        }

        // Flip second card and evaluate
        setDeck((d) =>
          d.map((c) => (c.id === id ? { ...c, flipped: true } : c))
        );
        setMoves((m) => m + 1);
        setLocked(true);

        const [firstId] = prev;
        setTimeout(() => {
          setDeck((d) => {
            const firstCard = d.find((c) => c.id === firstId);
            const secondCard = d.find((c) => c.id === id);
            const isMatch = firstCard?.symbol === secondCard?.symbol;

            if (isMatch) {
              setMatches((m) => m + 1);
              return d.map((c) =>
                c.id === firstId || c.id === id
                  ? { ...c, flipped: false, matched: true }
                  : c
              );
            }
            return d.map((c) =>
              c.id === firstId || c.id === id
                ? { ...c, flipped: false }
                : c
            );
          });
          setFlipped([]);
          setLocked(false);
        }, FLIP_DELAY_MS);

        return [];
      });
    },
    [locked, running, gameWon]
  );

  // ── New game ─────────────────────────────────────────────────────────────
  const startNewGame = useCallback(
    (diff = difficulty) => {
      clearInterval(timerRef.current);
      setDifficulty(diff);
      setDeck(buildDeck(CARD_SETS[diff]));
      setFlipped([]);
      setLocked(false);
      setMoves(0);
      setMatches(0);
      setTime(0);
      setRunning(false);
      setGameWon(false);
      setShowConfetti(false);
    },
    [difficulty]
  );

  // ── Helpers ──────────────────────────────────────────────────────────────
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const totalPairs = CARD_SETS[difficulty].length;
  const progressPct = Math.round((matches / totalPairs) * 100);
  const best = bestScores[difficulty];
  const gridCols = GRID_COLS[difficulty];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mcg-wrapper">
      {/* Confetti burst */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="mcg-confetti-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.span
                key={i}
                className="mcg-confetti-dot"
                initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                animate={{
                  y: Math.random() * -400 - 100,
                  x: (Math.random() - 0.5) * 600,
                  opacity: 0,
                  scale: Math.random() * 1.5 + 0.5,
                  rotate: Math.random() * 720,
                }}
                transition={{ duration: 1.5 + Math.random(), ease: 'easeOut', delay: Math.random() * 0.3 }}
                style={{ '--dot-color': `hsl(${Math.random() * 360}, 90%, 60%)` }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mcg-container">
        {/* ── Header ── */}
        <motion.div
          className="mcg-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mcg-title">🃏 Memory Card Flip</h1>
          <p className="mcg-subtitle">Match all pairs as fast as you can</p>
        </motion.div>

        {/* ── Difficulty picker ── */}
        <motion.div
          className="mcg-difficulty-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {['easy', 'medium', 'hard'].map((diff) => (
            <button
              key={diff}
              className={`mcg-diff-btn ${difficulty === diff ? 'mcg-diff-btn--active' : ''}`}
              onClick={() => startNewGame(diff)}
            >
              {diff === 'easy' ? '🌱 Easy' : diff === 'medium' ? '🔥 Medium' : '💀 Hard'}
            </button>
          ))}
        </motion.div>

        {/* ── Stats bar ── */}
        <div className="mcg-stats">
          <div className="mcg-stat">
            <span className="mcg-stat-label">Moves</span>
            <strong className="mcg-stat-value">{moves}</strong>
          </div>
          <div className="mcg-stat">
            <span className="mcg-stat-label">Time</span>
            <strong className="mcg-stat-value">{formatTime(time)}</strong>
          </div>
          <div className="mcg-stat">
            <span className="mcg-stat-label">Pairs</span>
            <strong className="mcg-stat-value">
              {matches}/{totalPairs}
            </strong>
          </div>
          {best && (
            <div className="mcg-stat mcg-stat--best">
              <span className="mcg-stat-label">Best</span>
              <strong className="mcg-stat-value">
                {best.moves}m / {formatTime(best.time)}
              </strong>
            </div>
          )}
        </div>

        {/* ── Progress bar ── */}
        <div className="mcg-progress-track">
          <motion.div
            className="mcg-progress-fill"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* ── Win banner ── */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              className="mcg-win-banner"
              initial={{ opacity: 0, scale: 0.85, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <span className="mcg-win-emoji">🎉</span>
              <div>
                <p className="mcg-win-title">You won!</p>
                <p className="mcg-win-sub">
                  {moves} moves &middot; {formatTime(time)}
                  {best && best.moves === moves && best.time === time && ' 🏆 New best!'}
                </p>
              </div>
              <button className="mcg-play-again" onClick={() => startNewGame()}>
                Play again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Card grid ── */}
        <motion.div
          className="mcg-grid"
          style={{ '--grid-cols': gridCols }}
          layout
        >
          {deck.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={handleCardClick}
              disabled={locked || gameWon}
            />
          ))}
        </motion.div>

        {/* ── Controls ── */}
        <div className="mcg-controls">
          <button className="mcg-btn mcg-btn--ghost" onClick={() => startNewGame()}>
            🔄 New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryCardGame;
