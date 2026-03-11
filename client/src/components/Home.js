import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import './Home.css';
import HomeGameCard from './HomeGameCard';

const games = [
  {
    name: 'Tic-Tac-Toe',
    path: '/games/tic-tac-toe',
    label: 'Classic Strategy',
    token: 'XO',
    description: 'Fast rounds, sharp mind games, and endless rematches.',
    tone: 'cobalt',
  },
  {
    name: 'Rock-Paper-Scissors',
    path: '/games/rock-paper-scissors',
    label: 'Reaction Duel',
    token: 'RPS',
    description: 'A timeless duel where every prediction can flip the match.',
    tone: 'cobalt',
  },

  {
    name: 'Sliding Puzzle',
    path: '/games/sliding-puzzle',
    label: 'Brain Teaser',
    token: '🧩',
    description: 'Slide tiles into order — sounds easy, gets tricky fast.',
    tone: 'teal',
  },
  {
    name: 'Number Guessing',
    path: '/games/number-guessing',
    label: 'Mind Challenge',
    token: '100',
    description: 'Find the hidden number with smart hints and beat your best attempts.',
    tone: 'emerald',
  },
  {
    name: 'Snake',
    path: '/games/snake',
    label: 'Arcade Classic',
    token: '🐍',
    description: 'Grow your snake, collect food, and avoid crashing.',
    tone: 'emerald',
  },
  {
    name: 'Sudoku',
    path: '/games/sudoku',
    label: 'Logic Puzzle',
    token: '9×9',
    description: 'Fill every row, column, and box with 1–9. Pure logic, no guessing.',
    tone: 'cobalt',
  },
  {
    name: 'Memory Card Flip',
    path: '/games/memory-card',
    label: 'Memory Challenge',
    token: '🃏',
    description: 'Flip cards and match pairs — test your memory under the clock.',
    tone: 'teal',
  },
];

const stats = [
  { value: '3', label: 'Classic games live' },
  { value: '<10s', label: 'From click to match' },
  { value: '24/7', label: 'Always available' },
];

const features = [
  {
    title: 'Instant Sessions',
    description: 'No heavy setup. Open, choose, and play in one flow.',
  },
  {
    title: 'Competitive Feel',
    description: 'High-contrast boards and tactile controls keep every move intentional.',
  },
  {
    title: 'Built to Expand',
    description: 'New games and social features can slot in without redesigning the experience.',
  },
];

const heroItems = [
  'Polished game nights',
  'Smooth on desktop and mobile',
  'No clutter, all action',
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const Home = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const scrollMeter = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.35,
  });
  const heroOpacity = useTransform(scrollY, [0, 220, 520], [1, 0.95, 0]);
  const heroScale = useTransform(scrollY, [0, 520], [1, 0.93]);
  const heroY = useTransform(scrollY, [0, 520], [0, -90]);

  return (
    <main className="home-page">
      <motion.div className="home-scroll-meter" style={{ scaleX: scrollMeter }} />

      <motion.section className="home-hero-shell" style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
        <motion.div
          className="home-orb home-orb-one"
          animate={{ x: [0, 18, -6, 0], y: [0, -10, 8, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
        />
        <motion.div
          className="home-orb home-orb-two"
          animate={{ x: [0, -14, 10, 0], y: [0, 12, -6, 0], scale: [1, 0.94, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        />

        <motion.div className="home-hero-grid" initial="hidden" animate="show" variants={sectionVariants}>
          <motion.div className="home-hero-copy" variants={itemVariants}>
            <span className="home-kicker">New era arcade hub</span>
            <h1>Play iconic games in a cinematic, modern interface.</h1>
            <p>
              GameHub turns classic gameplay into a premium web experience with bold visuals,
              responsive motion, and fast access to every match.
            </p>

            <div className="home-cta-row">
              <Link to="/games/tic-tac-toe" className="home-btn home-btn-primary">
                Start playing
              </Link>
              <Link to="/register" className="home-btn home-btn-ghost">
                Create account
              </Link>
            </div>

            <ul className="home-stat-strip" aria-label="Platform stats">
              {stats.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.aside
            className="home-hero-panel"
            variants={itemVariants}
            whileHover={{ rotateX: 5, rotateY: -5, y: -8, transition: { duration: 0.3 } }}
          >
            <p className="home-panel-title">Why players stay</p>
            <ul className="home-highlight-list">
              {heroItems.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.1, duration: 0.45 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="home-panel-chip"
              animate={{ rotate: [0, 6, -5, 0], scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            >
              Ready for rematch
            </motion.div>
          </motion.aside>
        </motion.div>
      </motion.section>

      <motion.section
        className="home-marquee"
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.25 }}
        variants={sectionVariants}
      >
        <motion.div
          className="home-marquee-track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(2)].map((_, runIndex) => (
            <React.Fragment key={runIndex}>
              <span>Realtime rounds</span>
              <span>Instant reset</span>
              <span>Competitive pacing</span>
              <span>Designed to feel premium</span>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="home-games-section"
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.2 }}
        variants={sectionVariants}
      >
        <motion.div variants={itemVariants} className="home-section-head">
          <span>Choose your arena</span>
          <h2>Every game card is built like a launch pad.</h2>
        </motion.div>

        <div className="home-game-grid">
          {games.map((game) => (
            <motion.div key={game.path} variants={itemVariants}>
              <HomeGameCard {...game} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="home-feature-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.25 }}
        variants={sectionVariants}
      >
        {features.map((feature) => (
          <motion.article
            key={feature.title}
            className="home-feature-card"
            variants={itemVariants}
            whileHover={{ y: -7, transition: { duration: 0.25 } }}
          >
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.article>
        ))}
      </motion.section>

      <motion.section
        className="home-final-cta"
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.4 }}
        variants={sectionVariants}
      >
        <motion.h2 variants={itemVariants}>Ready to become the player everyone remembers?</motion.h2>
        <motion.p variants={itemVariants}>
          Step in now, challenge a classic, and turn quick rounds into daily rituals.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link to="/games/rock-paper-scissors" className="home-btn home-btn-primary">
            Play now
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default Home;
