import React, { useState } from 'react';
import axios from 'axios';

const RockPaperScissors = () => {
    const [playerChoice, setPlayerChoice] = useState(null);
    const [aiChoice, setAiChoice] = useState(null);
    const [result, setResult] = useState(null);

    const choices = ['Rock', 'Paper', 'Scissors'];

    const play = (choice) => {
        const ai = choices[Math.floor(Math.random() * 3)];
        setPlayerChoice(choice);
        setAiChoice(ai);
        determineWinner(choice, ai);
    };

    const determineWinner = (player, ai) => {
        if (player === ai) {
            setResult('Draw');
            return;
        }
        if (
            (player === 'Rock' && ai === 'Scissors') ||
            (player === 'Paper' && ai === 'Rock') ||
            (player === 'Scissors' && ai === 'Paper')
        ) {
            setResult('You Win!');
            saveScore(1);
        } else {
            setResult('AI Wins!');
            saveScore(0);
        }
    };

    const saveScore = async (score) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await axios.post('/api/scores', { game: 'RockPaperScissors', score }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Rock-Paper-Scissors</h2>
            <button onClick={() => play('Rock')}>Rock</button>
            <button onClick={() => play('Paper')}>Paper</button>
            <button onClick={() => play('Scissors')}>Scissors</button>
            {playerChoice && (
                <p>You chose: {playerChoice} | AI chose: {aiChoice} | Result: {result}</p>
            )}
        </div>
    );
};

export default RockPaperScissors;