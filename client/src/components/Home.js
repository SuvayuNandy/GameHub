import React from 'react';
import { Link } from 'react-router-dom';
import GameList from './GameList';

const Home = () => {
    return (
        <div>
            <h1>Welcome to GameHub</h1>
            <p>Play multiple games in one platform!</p>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            <GameList />
        </div>
    );
};

export default Home;