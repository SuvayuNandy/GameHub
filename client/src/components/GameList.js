import React from 'react';
import { Link } from 'react-router-dom';

const GameList = () => {
    return (
        <div>
            <h2>Available Games</h2>
            <ul>
                <li><Link to="/games/tic-tac-toe">Tic-Tac-Toe</Link></li>
                <li><Link to="/games/rock-paper-scissors">Rock-Paper-Scissors</Link></li>
                {/* Add new games here, e.g., <li><Link to="/games/new-game">New Game</Link></li> */}
            </ul>
        </div>
    );
};

export default GameList;