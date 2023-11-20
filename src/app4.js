import React, { useEffect, useState } from 'react';

const PUBG_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE "; // Insert your PUBG API key here

const PlayerInfo = () => {
    const [playerData, setPlayerData] = useState(null);

    useEffect(() => {
      const fetchPlayerData = async () => {
        const playerName = 'E1_Duderino';
        const playerResponse = await fetch(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${playerName}`, {
          headers: {
            'Authorization': `Bearer ${PUBG_API_KEY}`,
            'Accept': 'application/vnd.api+json'
          }
        });
  
        const playerData = await playerResponse.json();
        setPlayerData(playerData);
        console.log(playerData); // Log the player data to the console
      };
  
      fetchPlayerData();
    }, []);
  
    return (
      <div>
        {playerData ? (
          <pre>{JSON.stringify(playerData, null, 2)}</pre>
        ) : (
          <p>Loading player data...</p>
        )}
      </div>
    );
  };
  

export default PlayerInfo
