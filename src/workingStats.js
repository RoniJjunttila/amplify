import React, { useEffect, useState } from "react";

//team id kuntoo!!!!
//Tehä damage datasta timeline tyyppinen enemmän. Ajan perusteella

const PUBG_API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE "; // Insert your PUBG API key here

const PlayerInfo = () => {
  const [playerData, setPlayerData] = useState(null);
  const [matchesArray, setMatchesArray] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [selectedGame, setSeletedGame] = useState(0);
  const [selectedPlayer, setSeletedPlayer] = useState(0);
  const [victimArray, setVictimArray] = useState([]);
  const [attackerArray, setAttackerArray] = useState([]);
  const playerNames = [
    "E1_Duderino",
    "MunatonEpaemies",
    "HlGHLANDER",
    "bold_moves_bob",
  ];
  const [additionalMatchData, setAdditionalMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [combinedArrayData, SetCombinedArrayData] = useState([]);

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
      try {
        setLoading(true);
  
        if (matchesArray.length > 0) {
          const matchId = matchesArray[selectedGame];
  
          const matchResponse = await fetch(
            `https://api.pubg.com/shards/steam/matches/${matchId}`,
            {
              headers: {
                Authorization: `Bearer ${PUBG_API_KEY}`,
                Accept: "application/vnd.api+json",
              },
            }
          );
  
          const matchData = await matchResponse.json();
          setMatchData(matchData);
  
          const telemetryId =
            matchData.data.relationships.assets.data[0].id;
  
          // Extract the telemetry URL from the match data
          const telemetryURL = matchData.included.find(
            (item) => item.type === "asset" && item.id === telemetryId
          ).attributes.URL;
  
          // Make a request to the telemetry URL
          const telemetryResponse = await fetch(telemetryURL, {
            headers: {
              Accept: "application/vnd.api+json",
            },
          });
  
          const telemetryData = await telemetryResponse.json();
  
          const attackerEvents = telemetryData.filter((event) => {
            return (
              event._T === "LogPlayerTakeDamage" &&
              event.attacker &&
              event.attacker.name === playerNames[selectedPlayer] &&
              event.attacker.health !== 0 &&
              event.damage !== 0 &&
              event.damageReason !== "None"
            );
          });
  
          // Filter for events where the player is the victim and attackId is not -1
          const victimEvents = telemetryData.filter((event) => {
            return (
              event._T === "LogPlayerTakeDamage" &&
              event.victim &&
              event.victim.name === playerNames[selectedPlayer] &&
              event.attackId !== -1
            );
          });
  
          // Map relevant information for each attacker event
          const attackerArrayData = attackerEvents.map((event) => ({
            attacker: {
              name: event.attacker.name,
              health: event.attacker.health,
            },
            victim: {
              name: event.victim.name,
              health: event.victim.health,
            },
            damage: event.damage,
            damageCauserName: event.damageCauserName,
            damageReason: event.damageReason,
            time: event._D,
          }));
          
  
          // Map relevant information for each victim event
          const victimArrayData = victimEvents.map((event) => ({
            attacker: {
              name: event.attacker.name,
              health: event.attacker.health,
            },
            victim: {
              name: event.victim.name,
              health: event.victim.health,
            },
            damage: event.damage,
            damageCauserName: event.damageCauserName,
            damageReason: event.damageReason,
            time: event._D,
          }));
  
          // Combine and sort the arrays
          const combinedArrayData = [...attackerArrayData, ...victimArrayData].sort(
            (a, b) => new Date(a.time) - new Date(b.time)
          );
  
          SetCombinedArrayData(combinedArrayData);
          console.log(combinedArrayData)
        }
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMatchData();
  }, [matchesArray, selectedGame, selectedPlayer]);

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
          {combinedArrayData.length > 0 && (
  <div>
    <h2>Combined Data:</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Health</th>
          <th>Damage</th>
          <th>Damage Cause</th>
          <th>Damage Reason</th>
          <th>Victim Name</th>
          <th>Victim Health</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {combinedArrayData.map((data, index) => (
          <tr key={index}>
            <td>{data.attacker ? data.attacker.name : data.name}</td>
            <td>{Math.round(data.attacker ? data.attacker.health : data.health)}</td>
            <td>{Math.round(data.damage)}</td>
            <td>{data.damageCauserName}</td>
            <td>{data.damageReason}</td>
            <td>{data.victim ? data.victim.name : data.attacker.name}</td>
            <td>{Math.round(data.victim ? data.victim.health : data.victimHealth)}</td>
            <td>{data.time.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


        </div>
      ) : (
        <p>Loading match data...</p>
      )}
    </div>
  );
};
export default PlayerInfo;







/*

  {victimArray.length > 0 && (
  <div>
    <h2>Combined Data:</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Health</th>
          <th>Damage</th>
          <th>Damage Cause</th>
          <th>Damage Reason</th>
          <th>Victim Name</th>
          <th>Victim Health</th>
        </tr>
      </thead>
      <tbody>
        {attackerArray.map((attackerData, index) => (
          <tr key={index}>
            <td>{attackerData.name}</td>
            <td>{attackerData.time}</td>
            <td>{Math.round(attackerData.health)}</td>
            <td>{Math.round(attackerData.damage)}</td>
            <td>{attackerData.damageReason}</td>
            <td>
              {Math.round(attackerData.victimHealth)} to{" "}
              {Math.round(attackerData.victimHealth - attackerData.damage) !== 0
                ? Math.round(attackerData.victimHealth - attackerData.damage)
                : "knock"}
            </td>
            <td>{attackerData.damageCauserName}</td>
            <td>{attackerData.victim}</td>

          </tr>
        ))}
        {victimArray.map((victimData, index) => (
          <tr key={index}>
            <td>{victimData.attacker.name}</td>
            <td>{victimData.time}</td>
            <td>{Math.round(victimData.attacker.health)}</td>
            <td>{Math.round(victimData.damage)}</td>
            <td>{victimData.damageReason}</td>
            <td>
              {Math.round(victimData.victim.health)} to{" "}
              {Math.round(victimData.victim.health - victimData.damage) !== 0
                ? Math.round(victimData.victim.health - victimData.damage)
                : "knock"}
            </td> 
            <td>{victimData.damageCauserName}</td>
            <td>{victimData.victim.name}</td>
      
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)} */