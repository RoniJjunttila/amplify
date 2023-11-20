import React, { useEffect, useState } from 'react';

const PUBG_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE "; // Insert your PUBG API key here

const PlayerInfo = () => {
  const [playerData, setPlayerData] = useState(null);

  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      const matchId = '455891b7-c889-491c-af99-88c69cd0ff57';
      const matchResponse = await fetch(`https://api.pubg.com/shards/steam/matches/${matchId}`, {
        headers: {
          'Authorization': `Bearer ${PUBG_API_KEY}`,
          'Accept': 'application/vnd.api+json'
        }
      });

      const matchData = await matchResponse.json();
      setMatchData(matchData);
    };

    fetchMatchData();
  }, []);

  return (
    <div>
      {matchData ? (
        <pre>{JSON.stringify(matchData, null, 2)}</pre>
      ) : (
        <p>Loading match data...</p>
      )}
    </div>
  );
};

export default PlayerInfo
