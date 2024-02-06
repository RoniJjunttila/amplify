// Modal.js

import React, { useState, useEffect} from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

const PlayerData = ({ isOpen, closeModal, content }) => {

function mathRound(num) {
    const factor = Math.pow(10, 2); //2 = decimal
    return Math.round(num * factor) / factor;
}

const apiKey =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE "; // Insert your PUBG API key here
const seasonId = "division.bro.official.pc-2018-27";

const headers = {
  accept: "application/vnd.api+json",
  Authorization: "Bearer " + apiKey,
};

const playerNames = [content]; 
const [name, setName] = useState("");

  async function fetchData(url) {
    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      setName(data.data[0].attributes.name);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return null;
    }
  }

  function calculateStats(playerData) {
    const stats = {
      KDratio: mathRound(playerData.attributes.gameModeStats["squad-fpp"].kills / playerData.attributes.gameModeStats["squad-fpp"].losses),
      wins: playerData.attributes.gameModeStats["squad-fpp"].wins,
      assists: playerData.attributes.gameModeStats["squad-fpp"].assists,
      kills: playerData.attributes.gameModeStats["squad-fpp"].kills,
      longestKill: mathRound(playerData.attributes.gameModeStats["squad-fpp"].longestKill) + " m",
      top10s: playerData.attributes.gameModeStats["squad-fpp"].top10s,
      boosts: playerData.attributes.gameModeStats["squad-fpp"].boosts,
      dBNOs: playerData.attributes.gameModeStats["squad-fpp"].dBNOs,
      dailyKills: playerData.attributes.gameModeStats["squad-fpp"].dailyKills,
      dailyWins: playerData.attributes.gameModeStats["squad-fpp"].dailyWins,
      weeklyKills: playerData.attributes.gameModeStats["squad-fpp"].weeklyKills,
      weeklyWins: playerData.attributes.gameModeStats["squad-fpp"].weeklyWins,
      damageDealt: playerData.attributes.gameModeStats["squad-fpp"].damageDealt,
      days: playerData.attributes.gameModeStats["squad-fpp"].days,
      headshotKills:
        playerData.attributes.gameModeStats["squad-fpp"].headshotKills,
      heals: playerData.attributes.gameModeStats["squad-fpp"].heals,
      killPoints: playerData.attributes.gameModeStats["squad-fpp"].killPoints,
      longestTimeSurvived:
        playerData.attributes.gameModeStats["squad-fpp"].longestTimeSurvived,
      losses: playerData.attributes.gameModeStats["squad-fpp"].losses,
      maxKillStreaks:
        playerData.attributes.gameModeStats["squad-fpp"].maxKillStreaks,
      mostSurvivalTime:
        playerData.attributes.gameModeStats["squad-fpp"].mostSurvivalTime,
      rankPoints: playerData.attributes.gameModeStats["squad-fpp"].rankPoints,
      rankPointsTitle:
        playerData.attributes.gameModeStats["squad-fpp"].rankPointsTitle,
      revives: playerData.attributes.gameModeStats["squad-fpp"].revives,
      rideDistance:
        Math.round(playerData.attributes.gameModeStats["squad-fpp"].rideDistance / 1000) + " km",
      roadKills: playerData.attributes.gameModeStats["squad-fpp"].roadKills,
      roundMostKills:
        playerData.attributes.gameModeStats["squad-fpp"].roundMostKills,
      roundsPlayed:
        playerData.attributes.gameModeStats["squad-fpp"].roundsPlayed,
      suicides: playerData.attributes.gameModeStats["squad-fpp"].suicides,
      swimDistance:
        playerData.attributes.gameModeStats["squad-fpp"].swimDistance,
      teamKills: playerData.attributes.gameModeStats["squad-fpp"].teamKills,
      timeSurvived:
        playerData.attributes.gameModeStats["squad-fpp"].timeSurvived,
      vehicleDestroys:
        playerData.attributes.gameModeStats["squad-fpp"].vehicleDestroys,
      walkDistance:
        Math.round(playerData.attributes.gameModeStats["squad-fpp"].walkDistance / 1000) + " km",
      weaponsAcquired:
        playerData.attributes.gameModeStats["squad-fpp"].weaponsAcquired,
      winPoints: playerData.attributes.gameModeStats["squad-fpp"].winPoints,
    };
    return stats;
  }

  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
  
    const fetchDataAndCalculateStats = async () => {
      let playerIds = "";
      for (let i = 0; i < playerNames.length; i++) {
        playerIds +=
          i < playerNames.length - 1 ? playerNames[i] + "%2C" : playerNames[i];
      }

      const getPlayerIdsUrl = `https://api.pubg.com/shards/steam/players?filter[playerNames]=${playerIds}`;
      const playerIdsResponse = await fetchData(getPlayerIdsUrl);

      if (!playerIdsResponse) {
        console.error("Unable to retrieve player IDs.");
        return;
      }

      let playerIdsQueryParam = "";
      for (let i = 0; i < playerIdsResponse.data.length; i++) {
        playerIdsQueryParam +=
          i < playerIdsResponse.data.length - 1
            ? playerIdsResponse.data[i].id + "%2C"
            : playerIdsResponse.data[i].id;
      }

      const getPlayerStatsUrl = `https://api.pubg.com/shards/steam/seasons/${seasonId}/gameMode/squad-fpp/players?filter[playerIds]=${playerIdsQueryParam}`;
      const playerStatsResponse = await fetchData(getPlayerStatsUrl);

      if (!playerStatsResponse) {
        console.error("Unable to retrieve player statistics.");
        return;
      }
      const playerStatsData = playerStatsResponse.data;
      const calculatedStats = playerStatsData.map((playerData) => {
        const stats = calculateStats(playerData);
        return {
          playerName: playerData.attributes.name,
          stats: stats,
        };
      });

      setPlayerStats(calculatedStats);
    };

    fetchDataAndCalculateStats();
  }, [content]); 

  return (
<Modal
  isOpen={isOpen}
  onRequestClose={closeModal}
  contentLabel="Example Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    content: {
      width: '60%', 
      margin: 'auto', 
      borderRadius: '10px', 
      padding: '20px', 
    },
  }}
>
  <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
    <div>
      <h2>Season data</h2>
      <ul>
        {playerStats.map((player, index) => (
          <li key={index}>
            <ul>
              <li style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                {playerNames[index]}
              </li>
              {Object.entries(player.stats).map(([statName, statValue]) => (
                <li key={statName}>
                  {statName}: {statValue}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </div>
</Modal>

  );
};

export default PlayerData;
