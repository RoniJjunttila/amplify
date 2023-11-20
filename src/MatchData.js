import React, { useEffect, useState } from "react";

const PUBG_API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE "; // Insert your PUBG API key here

const MatchData = () => {
  const [playerData, setPlayerData] = useState(null);
  const [matchesArray, setMatchesArray] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [selectedGame, setSeletedGame] = useState(0);
  const [selectedPlayer, setSeletedPlayer] = useState(0);
  const playerNames = [
    "E1_Duderino",
    "MunatonEpaemies",
    "HlGHLANDER",
    "bold_moves_bob",
  ];

  useEffect(() => {
    const fetchPlayerData = async () => {
      const playerResponse = await fetch(
        `https://api.pubg.com/shards/steam/players?filter[playerNames]=${playerNames[selectedPlayer]}`,
        {
          headers: {
            Authorization: `Bearer ${PUBG_API_KEY}`,
            Accept: "application/vnd.api+json",
          },
        }
      );
      const matches = [];
      const playerData = await playerResponse.json();
      setPlayerData(playerData);
      for (let i = 0; i < 19; i++) {
        matches.push(playerData.data[0].relationships.matches.data[i].id);
      }
      setMatchesArray([...matches]);
    };

    fetchPlayerData();
  }, [selectedPlayer]);

  useEffect(() => {
    const fetchMatchData = async () => {
      if (matchesArray.length > 0) {
        try {
          const matchResponse = await fetch(
            `https://api.pubg.com/shards/steam/matches/${matchesArray[selectedGame]}`,
            {
              headers: {
                Authorization: `Bearer ${PUBG_API_KEY}`,
                Accept: "application/vnd.api+json",
              },
            }
          );
          const matchData = await matchResponse.json();
          setMatchData(matchData);
        } catch (error) {
          console.error("Error fetching match data:", error);
          setMatchData(null); // Set matchData to null to indicate an error
        }
      }
    };

    fetchMatchData();
  }, [matchesArray, selectedGame]);

  return (
    <div>
      <div>
        <label>Games:</label>
        <select onChange={(event) => setSeletedGame(event.target.value)}>
          {matchesArray.map((key, id) => (
            <option key={id} value={id}>
              Game {key}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Player: </label>
        <select onChange={(event) => setSeletedPlayer(event.target.value)}>
          {playerNames.map((key, id) => (
            <option key={key} value={id}>
              {key}
            </option>
          ))}
        </select>
      </div>

      {matchData ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Kills</th>
                <th>Assists</th>
                <th>Dmg_Dealt</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              {matchData.included &&
                matchData.included
                  .filter((participant) => participant.attributes.stats)
                  .sort((a, b) => {
                    const winPlaceA = a.attributes.stats.winPlace || 0;
                    const winPlaceB = b.attributes.stats.winPlace || 0;
                    return winPlaceA - winPlaceB;
                  })
                  .map((participant, index, participants) => {
                    const stats = participant.attributes.stats || {};
                    const { name, kills, assists, damageDealt, winPlace } =
                      stats;
                    const isFirstParticipant = index === 0;
                    const prevWinPlace = isFirstParticipant
                      ? null
                      : participants[index - 1].attributes.stats.winPlace;
                    const winPlaceChanged =
                      !isFirstParticipant && winPlace !== prevWinPlace;
                    return (
                      <React.Fragment key={participant.id}>
                        {winPlaceChanged && (
                          <tr>
                            <td>-------------------</td>
                          </tr>
                        )}
                        <tr>
                          {name === "E1_Duderino" ||
                          name === "MunatonEpaemies" ||
                          name === "HlGHLANDER" ||
                          name === "bold_moves_bob" ? (
                            <td style={{ fontWeight: "bold" }}>{name}</td>
                          ) : (
                            <td>{name}</td>
                          )}
                          <td>{kills}</td>
                          <td>{assists}</td>
                          <td>{damageDealt}</td>
                          <td>{winPlace}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading match data...</p>
      )}
    </div>
  );
};
export default MatchData;

/* return (
  <div>
    {matchData ? (
      <div>
        {matchData.included
          .filter(participant => participant.attributes.stats)
          .filter(participant => ['E1_Duderino', 'HlGHLANDER','MunatonEpaemies','boldmovesbobo'].includes(participant.attributes.stats.name))
          .map(participant => {
            const stats = participant.attributes.stats || {};
            const { playerId, ...statsWithoutPlayerId } = stats;

            return (
              <pre key={participant.id}>{JSON.stringify(statsWithoutPlayerId, null, 2)}</pre>
            );
          })}
      </div>
    ) : (
      <p>Loading match data...</p>
    )}
  </div>
);
}       */
