import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState(null);

    const handleClick = (index) => {
        if (board[index] || winner || !isPlayerTurn) return;
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);
        checkWinner(newBoard, 'X');
    };

    const aiMove = useCallback(() => {
        let available = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (available.length === 0) return;
        const move = available[Math.floor(Math.random() * available.length)];
        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        setIsPlayerTurn(true);
        checkWinner(newBoard, 'O');
    }, [board]);

    const checkWinner = (board, player) => {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let win of wins) {
            if (win.every(idx => board[idx] === player)) {
                setWinner(player);
                saveScore(player === 'X' ? 1 : 0);  // 1 for win, 0 for loss
                return;
            }
        }
        if (!board.includes(null)) setWinner('Draw');
    };

    const saveScore = async (score) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await axios.post('/api/scores', { game: 'TicTacToe', score }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => aiMove(), 500);
        return () => clearTimeout(timer);
    }, [isPlayerTurn, winner, aiMove]);

    return (
        <div>
            <h2>Tic-Tac-Toe</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '300px' }}>
                {board.map((cell, idx) => (
                    <button key={idx} onClick={() => handleClick(idx)} style={{ height: '100px', fontSize: '50px' }}>
                        {cell}
                    </button>
                ))}
            </div>
            {winner && <p>{winner === 'Draw' ? 'Draw!' : `Winner: ${winner}`}</p>}
        </div>
    );
};

export default TicTacToe;