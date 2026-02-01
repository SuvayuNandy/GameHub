const express = require('express');
const jwt = require('jsonwebtoken');
const Score = require('../models/Score');

const router = express.Router();

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.post('/', authMiddleware, async (req, res) => {
    const { game, score } = req.body;
    try {
        const newScore = new Score({ userId: req.userId, game, score });
        await newScore.save();
        res.status(201).json({ message: 'Score saved' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:game', authMiddleware, async (req, res) => {
    try {
        const scores = await Score.find({ game: req.params.game }).sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;