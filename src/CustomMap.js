// CustomMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CustomMap = () => {


/*   const PUBG_API_KEY =
"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE ";
const PUBG_API_KEY_2 =
"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzZTU2YTQ0MC03ZTNlLTAxM2MtMmZlYy0zZTQ5OWY3OWEzZGEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNzAyNzMwNDQwLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InByaXZhdGUtdXNlLXN0In0.mx__XYP8I1wTPR2JbKIUbccutTyHL0nX8USCGjMp3_8";
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
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

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
    } catch (error) {
      console.error("Error fetching player data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [selectedPlayer]);

 */
  // Custom tile layer URL
  const customTileLayerUrl = 'https://i.imgur.com/QZazUv6.jpg';

  // Custom icon for the marker
  const customIcon = new L.Icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX/AAAZ4gk3AAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  const customIcon2 = new L.Icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Color-blue.JPG',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Coordinates for the marker (assuming (0,0) is at the top-left corner)
  const markerPosition = [979632.25, 447521.59375];
  const markerPosition2 = [0, 0];

  return (
    <MapContainer center={markerPosition} zoom={10} style={{ height: '800px', width: '100%' }}>
      {/* Use the TileLayer component for the custom tile layer */}
      <TileLayer
        url={customTileLayerUrl}
        attribution='map from google' // Add attribution if required
      />

      {/* Add the first marker with the custom icon */}
      <Marker position={markerPosition} icon={customIcon}>
        <Popup>A custom marker with a custom icon!</Popup>
      </Marker>

      {/* Add the second marker at [0, 0] with the same custom icon */}
      <Marker position={markerPosition2} icon={customIcon2}>
        <Popup>Another marker at [0, 0]</Popup>
      </Marker>
    </MapContainer>
  );
};

export default CustomMap;
