import React, { useEffect, useState } from "react";
import "./App.css";
import PlayerData from "./Modal";

//searchiin kartta, sijotus
//tablet vierekkäin
//jakaa koodia

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
  const [lastTeamId, setLastTeamId] = useState(true);
  const playerNames = [
    "E1_Duderino",
    "MunatonEpaemies",
    "HlGHLANDER",
    "bold_moves_bob",
  ];
  const [loading, setLoading] = useState(false);
  const [combinedArrayData, SetCombinedArrayData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [SeasonDataPlayer, setSeasonDataPlayer] = useState("E1_Duderino");
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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

  useEffect(() => {
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
          const telemetryId = matchData.data.relationships.assets.data[0].id;
          const telemetryURL = matchData.included.find(
            (item) => item.type === "asset" && item.id === telemetryId
          ).attributes.URL;
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

          const victimEvents = telemetryData.filter((event) => {
            return (
              event._T === "LogPlayerTakeDamage" &&
              event.victim &&
              event.victim.name === playerNames[selectedPlayer] &&
              event.attackId !== -1
            );
          });

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

          const combinedArrayData = [
            ...attackerArrayData,
            ...victimArrayData,
          ].sort((a, b) => new Date(a.time) - new Date(b.time));

          SetCombinedArrayData(combinedArrayData);
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
    <div className="content">
      <div>
        <label>Games:</label>
        <select onChange={(event) => setSeletedGame(event.target.value)}>
          {matchesArray.map((key, id) => (
            <option key={id} value={id}>
              {key}
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
        <div className="datatable">
          <table className="ranking">
            <thead>
              <h2>Ranking:</h2>
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
                  .reduce((acc, participant) => {
                    const stats = participant.attributes.stats || {};
                    const {
                      name,
                      kills,
                      assists,
                      damageDealt,
                      winPlace,
                      teamId,
                    } = stats;

                    const teamIndex = acc.findIndex(
                      (team) => team[0].teamId === teamId
                    );

                    if (teamIndex === -1) {
                      acc.push([
                        { name, kills, assists, damageDealt, winPlace, teamId },
                      ]);
                    } else {
                      acc[teamIndex].push({
                        name,
                        kills,
                        assists,
                        damageDealt,
                        winPlace,
                        teamId,
                      });
                    }

                    return acc;
                  }, [])
                  .map((team, teamIndex, teams) => {
                    return (
                      <React.Fragment key={teamIndex}>
                        {team.map((player, index) => {
                          const currentWinPlace = player.winPlace;
                          const teamIdChanged =
                            index > 0 &&
                            currentWinPlace !== team[index - 1].winPlace;
                          const isPlayerNameNotEmpty =
                            player.name && player.name.trim() !== "";
                          return (
                            <React.Fragment key={`${teamIndex}_${index}`}>
                              {isPlayerNameNotEmpty && (
                                <React.Fragment>
                                  {teamIdChanged && (
                                    <tr>
                                      <td colSpan="5">
                                        ---------------------------------------------------
                                      </td>
                                    </tr>
                                  )}
                                  <tr>
                                    {player.name === "E1_Duderino" ||
                                    player.name === "keken_viikset" ||
                                    player.name === "HlGHLANDER" ||
                                    player.name === "bold_moves_bob" ? (
                                      <td style={{ fontWeight: "bold" }}>
                                        {player.name}
                                      </td>
                                    ) : (
                                      <td>
                                        {player.name ? (
                                          <button
                                            style={{
                                              background: "none",
                                              border: "none",
                                              padding: "0",
                                              textDecoration: "underline",
                                              cursor: "pointer",
                                              color: "blue",
                                            }}
                                            onClick={() => {
                                              openModal();
                                              setSeasonDataPlayer(player.name);
                                            }}
                                          >
                                            {player.name}
                                          </button>
                                        ) : (
                                          ""
                                        )}
                                      </td>
                                    )}
                                    <td>{player.kills}</td>
                                    <td>{player.assists}</td>
                                    <td>
                                      {!isNaN(Math.round(player.damageDealt))
                                        ? Math.round(player.damageDealt)
                                        : ""}
                                    </td>
                                    <td>{player.winPlace}</td>
                                  </tr>
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
            </tbody>
          </table>
          <div>
            <PlayerData
              isOpen={modalIsOpen}
              closeModal={closeModal}
              content={SeasonDataPlayer}
            />
          </div>
          {combinedArrayData.length > 0 && (
            <div className="datatable">
              <table>
                <thead>
                  <h2>Damage data:</h2>
                  <tr>
                    <th>Name</th>
                    <th>Health</th>
                    <th>Damage Cause</th>
                    <th>Damage Reason</th>
                    <th>Victim Name</th>
                    <th>Damage</th>
                    <th>Victim Health</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedArrayData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.attacker ? data.attacker.name : data.name}</td>
                      <td>
                        {Math.round(
                          data.attacker ? data.attacker.health : data.health
                        )}
                      </td>
                      <td>{data.damageCauserName}</td>
                      <td>{data.damageReason}</td>
                      <td>
                        {data.victim ? data.victim.name : data.attacker.name}
                      </td>
                      <td>{Math.round(data.damage)}</td>
                      <td>{
                        Math.round(data.victim.health) == 0 ? "knock" : 
                        data.victim
                          ? `${Math.round(data.victim.health)} to ${
                              Math.round(data.victim.health - data.damage) == 0
                                ? "knock"
                                : Math.round(data.victim.health - data.damage)
                            }`
                          : Math.round(data.victimHealth)}
                      </td>
                      <td>
                        {new Date(data.time).toLocaleTimeString("en-FI", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                        :{new Date(data.time).getSeconds()}
                      </td>
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
