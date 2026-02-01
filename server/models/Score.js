const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    game: { type: String, required: true },  // e.g., 'TicTacToe'
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', scoreSchema);