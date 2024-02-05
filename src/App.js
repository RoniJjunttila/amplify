// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MatchData from './MatchData';
import SeasonData from './SeasonData';
import CustomMap from './CustomMap';
import './App.css';
import PlayerData from './Modal';

const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [SeasonDataPlayer, setSeasonDataPlayer] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSearch = () => {
    setSeasonDataPlayer(searchValue);
    openModal();
  };

  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li>
              <Link to="/">Matches</Link>
            </li>
            <li>
              <Link to="/SeasonData">Season data</Link>
            </li>
            <li>
              <Link to="/CustomMap">Map</Link>
            </li>
            <li style={{ color: 'white' }}>
              <input
                placeholder="player search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button onClick={handleSearch}>search</button>
            </li>
            <li style={{ color: 'white', marginLeft: '500px' }}>
              very work in progress
            </li>
          </ul>
        </nav>
        <hr />
        <PlayerData isOpen={modalIsOpen} closeModal={closeModal} content={SeasonDataPlayer} />
        <Routes>
          <Route path="/" element={<MatchData />} />
          <Route path="/SeasonData" element={<SeasonData />} />
          <Route path="/CustomMap" element={<CustomMap />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
