import React, { useEffect, useState } from "react";

const apiKey =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE "; // Insert your PUBG API key here
const seasonId = "division.bro.official.pc-2018-26";


//Season data

const headers = {
  accept: "application/vnd.api+json",
  Authorization: "Bearer " + apiKey,
};

const SeasonData = () => {
const playerNames = ["E1_Duderino", "MunatonEpaemies","HlGHLANDER","bold_moves_bob"]; 
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

  // Function to calculate statistics
  function calculateStats(playerData) {
    //console.log(playerData.attributes.gameModeStats["squad-fpp"]);
    const stats = {
      assists: playerData.attributes.gameModeStats["squad-fpp"].assists,
      boosts: playerData.attributes.gameModeStats["squad-fpp"].boosts,
      dBNOs: playerData.attributes.gameModeStats["squad-fpp"].dBNOs,
      dailyKills: playerData.attributes.gameModeStats["squad-fpp"].dailyKills,
      dailyWins: playerData.attributes.gameModeStats["squad-fpp"].dailyWins,
      damageDealt: playerData.attributes.gameModeStats["squad-fpp"].damageDealt,
      days: playerData.attributes.gameModeStats["squad-fpp"].days,
      headshotKills:
        playerData.attributes.gameModeStats["squad-fpp"].headshotKills,
      heals: playerData.attributes.gameModeStats["squad-fpp"].heals,
      killPoints: playerData.attributes.gameModeStats["squad-fpp"].killPoints,
      kills: playerData.attributes.gameModeStats["squad-fpp"].kills,
      longestKill: playerData.attributes.gameModeStats["squad-fpp"].longestKill + " m",
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
        playerData.attributes.gameModeStats["squad-fpp"].rideDistance / 1000 + " km",
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
      top10s: playerData.attributes.gameModeStats["squad-fpp"].top10s,
      vehicleDestroys:
        playerData.attributes.gameModeStats["squad-fpp"].vehicleDestroys,
      walkDistance:
        playerData.attributes.gameModeStats["squad-fpp"].walkDistance / 1000 + " km",
      weaponsAcquired:
        playerData.attributes.gameModeStats["squad-fpp"].weaponsAcquired,
      weeklyKills: playerData.attributes.gameModeStats["squad-fpp"].weeklyKills,
      weeklyWins: playerData.attributes.gameModeStats["squad-fpp"].weeklyWins,
      winPoints: playerData.attributes.gameModeStats["squad-fpp"].winPoints,
      wins: playerData.attributes.gameModeStats["squad-fpp"].wins,
    };

   // stats.kdRatio = stats.kills / (stats.winPlace === 0 ? 1 : stats.winPlace);
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

      // Process and calculate statistics
      const playerStatsData = playerStatsResponse.data;
      const calculatedStats = playerStatsData.map((playerData) => {
        const stats = calculateStats(playerData);
        // Return the relevant data for your React component state
        console.log(playerData)
        return {
          playerName: playerData.attributes.name,
          stats: stats,
          // Add other relevant properties
        };
      });

      setPlayerStats(calculatedStats);
    };

    fetchDataAndCalculateStats();
  }, []); // Empty dependency array ensures that the effect runs once when the component mounts

  return (
    <div>
    <h2>Season data</h2>
    <ul>
      {playerStats.map((player, index) => (
        <li key={index} style={{ border: "1px solid #ccc", padding: "10px" }}>
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
  );
};
export default SeasonData;
