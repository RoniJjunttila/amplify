// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MatchData from './MatchData';
import SeasonData from './SeasonData';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Matches</Link>
            </li>
            <li>
              <Link to="/SeasonData">Season data</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<MatchData />} />
          <Route path="/SeasonData" element={<SeasonData />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
