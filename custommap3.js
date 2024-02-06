import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';


const CustomMap = () => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mapImage, setMapImage] = useState(null);
  const [markerImage, setMarkerImage] = useState(null);
  const [lines, setLines] = useState([]);
  const [drawing, setDrawing] = useState(false);

  const PUBG_API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE ";
  const PUBG_API_KEY_2 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzZTU2YTQ0MC03ZTNlLTAxM2MtMmZlYy0zZTQ5OWY3OWEzZGEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNzAyNzMwNDQwLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InByaXZhdGUtdXNlLXN0In0.mx__XYP8I1wTPR2JbKIUbccutTyHL0nX8USCGjMp3_8";
  const [playerData, setPlayerData] = useState(null);
  const [matchesArray, setMatchesArray] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [selectedGame, setSeletedGame] = useState(0);
  const [selectedPlayer, setSeletedPlayer] = useState(0);
  const [attackerArray, setAttackerArray] = useState([]);
  const playerNames = [
    "E1_Duderino",
    "keken_viikset",
    "HlGHLANDER",
    "bold_moves_bob",
  ];
  const mapNames = {
    Baltic_Main: "Erangel",
    Chimera_Main: "Paramo",
    Desert_Main: "Miramar",
    DihorOtok_Main: "Vikendi",
    Erangel_Main: "Erangel",
    Heaven_Main: "Haven",
    Kiki_Main: "Deston",
    Range_Main: "Camp Jackal",
    Savage_Main: "Sanhok",
    Summerland_Main: "Karakin",
    Tiger_Main: "Taego",
    Neon_Main: "Rondo",
  };
  let teamRank = 0;
  const [currentMapName, setCurrentMapName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [combinedArrayData, SetCombinedArrayData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [SeasonDataPlayer, setSeasonDataPlayer] = useState("");
  const [location, setLocation] = useState({});
  const openModal = (val) => {
    setSeasonDataPlayer(val)
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
                Authorization: `Bearer ${PUBG_API_KEY_2}`,
                Accept: "application/vnd.api+json",
              },
            }
          );

          const matchData = await matchResponse.json();
          setMatchData(matchData);
     //     console.log(matchData);
          const rosters = matchData.included.filter(
            (item) => item.type === "roster"
          );

          const participants = matchData.included.filter(
            (item) => item.type === "participant"
          );
          const rostersWithParticipants = rosters.filter((roster) =>
            roster.relationships.participants.data.some(
              (participant) => participant.type === "participant"
            )
          );
          console.log(participants)

          participants.forEach((participant) => {
            rostersWithParticipants.forEach((roster) => {
              if (
                roster.relationships.participants.data.some(
                  (rosterParticipant) => participant.id === rosterParticipant.id
                )
              ) {
                participant.attributes.stats.rank =
                  roster.attributes.stats.rank;
                participant.attributes.stats.teamId =
                  roster.attributes.stats.teamId;
              //console.log("Player:", participant.attributes.stats, "Team:", roster.attributes.stats);
              }
            });
          });

          matchData.included = matchData.included.filter(
            (item) => item.type !== "roster"
          );

         // console.log(matchData);

          const telemetryId = matchData.data.relationships.assets.data[0].id;
         
          const telemetryURL = matchData.included.find(
            (item) => item.type === "asset" && item.id === telemetryId
          ).attributes.URL;
          const telemetryResponse = await fetch(telemetryURL, {
            headers: {
              Accept: "application/vnd.api+json",
              "Accept-Encoding": "gzip",
            },
          });
         

          const telemetryData = await telemetryResponse.json();
          

          // Filter events of type "LogItemPickup" and having character information
          const characterName = "E1_Duderino";

          const characterEvents = telemetryData.filter((event) => {
            return event.character && event.character.name === characterName;
          });

          // Extract location data under each character
          const characterLocations = characterEvents.map((event) => {
            const { location } = event.character;
            return { location };
          });

         // console.log(characterLocations);
          const convertedPoints = characterLocations.flatMap((location) => [
            location.location.x / 427,
            location.location.y / 427,
          ]);
          
          setLines([...lines, { points: convertedPoints}])

          const searchValue = "LogMatchStart";
          const result = telemetryData.filter(
            (item) => item._T === searchValue
          );
          setCurrentMapName(mapNames[result[0].mapName]);
          
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
  

  useEffect(() => {
 
    const loadImages = async () => {
      const loadMapImage = new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.src = 'https://i.imgur.com/QZazUv6.jpg';
      });

      const loadMarkerImage = new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Color-blue.JPG';
      });

      setMapImage(await loadMapImage);
      setMarkerImage(await loadMarkerImage);
    };

    loadImages();
  }, []);

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const newScale = scale * (1 - e.evt.deltaY / 1000);
    setScale(Math.max(0.1, Math.min(3, newScale)));
  };

  const handleDragMove = (e) => {
    setOffset({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
<div style={{display: "flex"}}>
  <div>
  <table className="ranking">
            <caption>Ranking:</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Kills</th>
                <th>Placement</th>
              </tr>
            </thead>
            <tbody>
              {matchData.included &&
                matchData.included
                  .filter((participant) => participant.attributes.stats)
                  .sort((a, b) => {
                    const winPlaceA = a.attributes.stats.rank || 0;
                    const winPlaceB = b.attributes.stats.rank || 0;
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
                      rank,
                    } = stats;

                    const teamIndex = acc.findIndex(
                      (team) => team.length > 0 && team[0].teamId === teamId
                    );
                    if (teamIndex === -1) {
                      acc.push([
                        {
                          name,
                          kills,
                          assists,
                          damageDealt,
                          winPlace,
                          teamId,
                          rank,
                        },
                      ]);
                    } else {
                      acc[teamIndex].push({
                        name,
                        kills,
                        assists,
                        damageDealt,
                        winPlace,
                        teamId,
                        rank,
                      });
                    }
                    return acc;
                  }, [])

                  .map((team, teamIndex) => {
                    return (
                      <React.Fragment key={teamIndex}>
                        {team.map((player, index) => {
                          if (player.name !== "undefined") {
                            const currentTeamId = player.teamId;
                            const previousTeamId =
                              index > 0 ? team[index - 1].teamId : false;

                            const teamIdChanged =
                              currentTeamId !== previousTeamId ||
                              previousTeamId == false;

                            const isPlayerNameNotEmpty =
                              player.name && player.name.trim() !== "";

                            return (
                              <React.Fragment key={`${teamIndex}_${index}`}>
                                {isPlayerNameNotEmpty && (
                                  <React.Fragment>
                                    {teamIdChanged && (
                                      <tr>
                                        <td style={{textAlign: "center"}} colSpan="1">
                                          Team {currentTeamId}
                                        </td>
                                      </tr>
                                    )} 
                                    <tr>
                                      {player.name === "E1_Duderino" ||
                                      player.name === "keken_viikset" ||
                                      player.name === "HlGHLANDER" ||
                                      player.name === "bold_moves_bob" ? (
                                        <td style={{ fontWeight: "bold" }}>
                                          <input type="checkbox" id="select" /> {player.name}
                                        </td>
                                      ) : (
                                        <td>
                                         <input type="checkbox" id="select" /> {player.name ? (
                                            <span
                                            >
                                              {player.name}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                      )}
                                      <td>{player.kills}</td>
                                      <td>{teamRank}</td>
                                    </tr>
                                  </React.Fragment>
                                )}
                              </React.Fragment>
                            );
                          }
                        }, teamRank++)}
                      </React.Fragment>
                    );
                  })}
            </tbody>
          </table>
  </div>
<Stage
    width={window.innerWidth}
    height={window.innerHeight}
    draggable
    scaleX={scale}
    scaleY={scale}
    x={offset.x}
    y={offset.y}
    onWheel={handleWheel}
    onDragMove={handleDragMove}
  >

    <Layer>
      {/* Use the KonvaImage component for the custom tile layer */}
      {mapImage && (
        <KonvaImage
          image={mapImage}
          width={window.innerWidth}
          height={window.innerWidth} // Set height to match the width
        />
      )}

      {/* Add the marker with the custom icon */}
      {markerImage && (
        <KonvaImage
          image={markerImage}
          width={32}
          height={32}
          x={979632.25 / scale - offset.x}
          y={447521.59375 / scale - offset.y}
        />
      )}
        {/* Render drawing lines */}
        {lines.map((line, index) => (
          <Line
            key={index}
            points={line.points}
            stroke="black"
            tension={.05}
          />
        ))}
      </Layer>
  </Stage>
</div>
  
  );
};

export default CustomMap;
