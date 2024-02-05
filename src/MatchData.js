import React, { useEffect, useState } from "react";
import "./App.css";
import PlayerData from "./Modal";
import "./matchData.css";
//viimeiset kymmenen peliä linkkin alle, tapot, sijotus, damage,
//graph jossa ois pelien trendi
//jakaa koodia
//https://github.com/pubg/api-assets/blob/master/dictionaries/telemetry/mapName.json telemetry data käännettynä

const PUBG_API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZTZhMjM4MC01YjkwLTAxM2ItOTg2Ny0wMzFhMzJiYjRkNTMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjcwNzY5OTUxLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6Im5pZ2hib3Qtc3RhdHMifQ.PubdgdyNbB2i6GZfpNQO8zflo050se4cNvpOGM2VxIE ";
const PUBG_API_KEY_2 =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzZTU2YTQ0MC03ZTNlLTAxM2MtMmZlYy0zZTQ5OWY3OWEzZGEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNzAyNzMwNDQwLCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6InByaXZhdGUtdXNlLXN0In0.mx__XYP8I1wTPR2JbKIUbccutTyHL0nX8USCGjMp3_8";

const PlayerInfo = () => {
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
  const damageCauser = {
    AIPawn_Base_Female_C: "AI Player",
    AIPawn_Base_Male_C: "AI Player",
    AirBoat_V2_C: "Airboat",
    AquaRail_A_01_C: "Aquarail",
    AquaRail_A_02_C: "Aquarail",
    AquaRail_A_03_C: "Aquarail",
    BP_ATV_C: "Quad",
    BP_BearV2_C: "Bear",
    BP_BRDM_C: "BRDM-2",
    BP_Bicycle_C: "Mountain Bike",
    BP_CoupeRB_C: "Coupe RB",
    BP_DO_Circle_Train_Merged_C: "Train",
    BP_DO_Line_Train_Dino_Merged_C: "Train",
    BP_DO_Line_Train_Merged_C: "Train",
    BP_Dirtbike_C: "Dirt Bike",
    BP_DronePackage_Projectile_C: "Drone",
    BP_Eragel_CargoShip01_C: "Ferry Damage",
    BP_FakeLootProj_AmmoBox_C: "Loot Truck",
    BP_FakeLootProj_MilitaryCrate_C: "Loot Truck",
    BP_FireEffectController_C: "Molotov Fire",
    BP_FireEffectController_JerryCan_C: "Jerrycan Fire",
    BP_Food_Truck_C: "Food Truck",
    BP_Helicopter_C: "Pillar Scout Helicopter",
    BP_IncendiaryDebuff_C: "Burn",
    BP_JerryCanFireDebuff_C: "Burn",
    BP_JerryCan_FuelPuddle_C: "Burn",
    BP_KillTruck_C: "Kill Truck",
    BP_LootTruck_C: "Loot Truck",
    BP_M_Rony_A_01_C: "Rony",
    BP_M_Rony_A_02_C: "Rony",
    BP_M_Rony_A_03_C: "Rony",
    BP_Mirado_A_02_C: "Mirado",
    BP_Mirado_A_03_Esports_C: "Mirado",
    BP_Mirado_Open_03_C: "Mirado (open top)",
    BP_Mirado_Open_04_C: "Mirado (open top)",
    BP_Mirado_Open_05_C: "Mirado (open top)",
    BP_MolotovFireDebuff_C: "Molotov Fire Damage",
    BP_Motorbike_04_C: "Motorcycle",
    BP_Motorbike_04_Desert_C: "Motorcycle",
    BP_Motorbike_04_SideCar_C: "Motorcycle (w/ Sidecar)",
    BP_Motorbike_04_SideCar_Desert_C: "Motorcycle (w/ Sidecar)",
    BP_Motorbike_Solitario_C: "Motorcycle",
    BP_Motorglider_C: "Motor Glider",
    BP_Motorglider_Green_C: "Motor Glider",
    BP_Niva_01_C: "Zima",
    BP_Niva_02_C: "Zima",
    BP_Niva_03_C: "Zima",
    BP_Niva_04_C: "Zima",
    BP_Niva_05_C: "Zima",
    BP_Niva_06_C: "Zima",
    BP_Niva_07_C: "Zima",
    BP_PickupTruck_A_01_C: "Pickup Truck (closed top)",
    BP_PickupTruck_A_02_C: "Pickup Truck (closed top)",
    BP_PickupTruck_A_03_C: "Pickup Truck (closed top)",
    BP_PickupTruck_A_04_C: "Pickup Truck (closed top)",
    BP_PickupTruck_A_05_C: "Pickup Truck (closed top)",
    BP_PickupTruck_A_esports_C: "Pickup Truck (closed top)",
    BP_PickupTruck_B_01_C: "Pickup Truck (open top)",
    BP_PickupTruck_B_02_C: "Pickup Truck (open top)",
    BP_PickupTruck_B_03_C: "Pickup Truck (open top)",
    BP_PickupTruck_B_04_C: "Pickup Truck (open top)",
    BP_PickupTruck_B_05_C: "Pickup Truck (open top)",
    BP_Pillar_Car_C: "Pillar Security Car",
    BP_PonyCoupe_C: "Pony Coupe",
    BP_Porter_C: "Porter",
    BP_Scooter_01_A_C: "Scooter",
    BP_Scooter_02_A_C: "Scooter",
    BP_Scooter_03_A_C: "Scooter",
    BP_Scooter_04_A_C: "Scooter",
    BP_Snowbike_01_C: "Snowbike",
    BP_Snowbike_02_C: "Snowbike",
    BP_Snowmobile_01_C: "Snowmobile",
    BP_Snowmobile_02_C: "Snowmobile",
    BP_Snowmobile_03_C: "Snowmobile",
    BP_Spiketrap_C: "Spike Trap",
    BP_TslGasPump_C: "Gas Pump",
    BP_TukTukTuk_A_01_C: "Tukshai",
    BP_TukTukTuk_A_02_C: "Tukshai",
    BP_TukTukTuk_A_03_C: "Tukshai",
    BP_Van_A_01_C: "Van",
    BP_Van_A_02_C: "Van",
    BP_Van_A_03_C: "Van",
    BattleRoyaleModeController_Chimera_C: "Bluezone",
    BattleRoyaleModeController_Def_C: "Bluezone",
    BattleRoyaleModeController_Desert_C: "Bluezone",
    BattleRoyaleModeController_DihorOtok_C: "Bluezone",
    BattleRoyaleModeController_Heaven_C: "Bluezone",
    BattleRoyaleModeController_Kiki_C: "Bluezone",
    BattleRoyaleModeController_Savage_C: "Bluezone",
    BattleRoyaleModeController_Summerland_C: "Bluezone",
    BattleRoyaleModeController_Tiger_C: "Bluezone",
    BlackZoneController_Def_C: "Blackzone",
    Bluezonebomb_EffectActor_C: "Bluezone Grenade",
    Boat_PG117_C: "PG-117",
    Buff_DecreaseBreathInApnea_C: "Drowning",
    Buggy_A_01_C: "Buggy",
    Buggy_A_02_C: "Buggy",
    Buggy_A_03_C: "Buggy",
    Buggy_A_04_C: "Buggy",
    Buggy_A_05_C: "Buggy",
    Buggy_A_06_C: "Buggy",
    Carepackage_Container_C: "Care Package",
    Dacia_A_01_v2_C: "Dacia",
    Dacia_A_01_v2_snow_C: "Dacia",
    Dacia_A_02_v2_C: "Dacia",
    Dacia_A_03_v2_C: "Dacia",
    Dacia_A_03_v2_Esports_C: "Dacia",
    Dacia_A_04_v2_C: "Dacia",
    DroppedItemGroup: "Object Fragments",
    EmergencyAircraft_Tiger_C: "Emergency Aircraft",
    Jerrycan: "Jerrycan",
    JerrycanFire: "Jerrycan Fire",
    Lava: "Lava",
    Mortar_Projectile_C: "Mortar Projectile",
    None: "None",
    PG117_A_01_C: "PG-117",
    PanzerFaust100M_Projectile_C: "Panzerfaust Projectile",
    PlayerFemale_A_C: "Player",
    PlayerMale_A_C: "Player",
    ProjC4_C: "C4",
    ProjGrenade_C: "Frag Grenade",
    ProjIncendiary_C: "Incendiary Projectile",
    ProjMolotov_C: "Molotov Cocktail",
    ProjMolotov_DamageField_Direct_C: "Molotov Cocktail Fire Field",
    ProjStickyGrenade_C: "Sticky Bomb",
    RacingDestructiblePropaneTankActor_C: "Propane Tank",
    RacingModeContorller_Desert_C: "Bluezone",
    RedZoneBomb_C: "Redzone",
    RedZoneBombingField: "Redzone",
    RedZoneBombingField_Def_C: "Redzone",
    TslDestructibleSurfaceManager: "Destructible Surface",
    TslPainCausingVolume: "Lava",
    Uaz_A_01_C: "UAZ (open top)",
    Uaz_Armored_C: "UAZ (armored)",
    Uaz_B_01_C: "UAZ (soft top)",
    Uaz_B_01_esports_C: "UAZ (soft top)",
    Uaz_C_01_C: "UAZ (hard top)",
    UltAIPawn_Base_Female_C: "Player",
    UltAIPawn_Base_Male_C: "Player",
    WeapACE32_C: "ACE32",
    WeapAK47_C: "AKM",
    WeapAUG_C: "AUG A3",
    WeapAWM_C: "AWM",
    WeapBerreta686_C: "S686",
    WeapBerylM762_C: "Beryl",
    WeapBizonPP19_C: "Beast son(bizon)",
    WeapCowbarProjectile_C: "Crowbar Projectile",
    WeapCowbar_C: "Crowbar",
    WeapCrossbow_1_C: "Crossbow",
    WeapDP12_C: "DBS",
    WeapDP28_C: "DP-28",
    WeapDesertEagle_C: "Deagle",
    WeapDuncansHK416_C: "M416",
    WeapFNFal_C: "SLR",
    WeapG18_C: "P18C",
    WeapG36C_C: "G36C",
    WeapGroza_C: "Groza",
    WeapHK416_C: "M416",
    WeapJuliesKar98k_C: "Kar98k",
    WeapK2_C: "K2",
    WeapKar98k_C: "Kar98k",
    WeapL6_C: "Lynx AMR",
    WeapLunchmeatsAK47_C: "AKM",
    WeapM16A4_C: "M16A4",
    WeapM1911_C: "P1911",
    WeapM249_C: "M249",
    WeapM24_C: "M24",
    WeapM9_C: "P92",
    WeapMG3_C: "MG3",
    WeapMP5K_C: "MP5K",
    WeapMP9_C: "MP9",
    WeapMacheteProjectile_C: "Machete Projectile",
    WeapMachete_C: "Machete",
    WeapMadsQBU88_C: "QBU88",
    WeapMini14_C: "Mini 14",
    WeapMk12_C: "Mk12",
    WeapMk14_C: "Mk14 EBR",
    WeapMk47Mutant_C: "Mk47 Mutant",
    WeapMosinNagant_C: "Mosin-Nagant",
    WeapNagantM1895_C: "R1895",
    WeapOriginS12_C: "O12",
    WeapP90_C: "P90",
    WeapPanProjectile_C: "Pan Projectile",
    WeapPan_C: "Pan",
    WeapPanzerFaust100M1_C: "Panzerfaust",
    WeapQBU88_C: "QBU88",
    WeapQBZ95_C: "QBZ95",
    WeapRhino_C: "R45",
    "WeapSCAR-L_C": "SCAR-L",
    WeapSKS_C: "SKS",
    WeapSaiga12_C: "S12K",
    WeapSawnoff_C: "Sawed-off",
    WeapSickleProjectile_C: "Sickle Projectile",
    WeapSickle_C: "Sickle",
    WeapThompson_C: "Tommy Gun",
    WeapTurret_KillTruck_Main_C: "Kill Truck Turret",
    WeapUMP_C: "UMP9",
    WeapUZI_C: "Micro Uzi",
    WeapVSS_C: "VSS",
    WeapVector_C: "Vector",
    WeapWin94_C: "Win94",
    WeapWinchester_C: "S1897",
    Weapvz61Skorpion_C: "Skorpion",
    WeapDragunov_C: "Metanov",
    WeapJS9_C: "JS9",
    WeapFamasG2_C: "Famas",
  };
  let teamRank = 0;
  const [currentMapName, setCurrentMapName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [combinedArrayData, SetCombinedArrayData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [SeasonDataPlayer, setSeasonDataPlayer] = useState("");
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

          console.log(matchData);

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

  return (
    <div className="content">
      <div className="selector">
        <div className="selector-item">
          <label>
            Map: {currentMapName}
            <br></br>
          </label>
        </div>
        <div className="selector-item">
          <label>Games:</label>
          <select onChange={(event) => setSeletedGame(event.target.value)}>
            {matchesArray.map((key, id) => (
              <option key={id} value={id}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="selector-item">
          <label>Player: </label>
          <select onChange={(event) => setSeletedPlayer(event.target.value)}>
            {playerNames.map((key, id) => (
              <option key={key} value={id}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>
      {matchData ? (
        <div className="datatable">
          <table className="ranking">
            <caption>Ranking:</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Kills</th>
                <th>Assists</th>
                <th>Damage dealt</th>
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
                                        <td colSpan="5">
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
                                          {player.name}
                                        </td>
                                      ) : (
                                        <td>
                                          {player.name ? (
                                            <button
                                              className="buttonlink"
                                              onClick={() => {
                                                  setSeasonDataPlayer(
                                                  player.name
                                                );
                                                openModal(player.name);
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
                <caption>Match damage data:</caption>
                <thead>
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
                      <td>
                        <button
                          className="buttonlink"
                          onClick={() => {
                            openModal(data.attacker ? data.attacker.name : data.name);
                          }}
                        >
                          {data.attacker ? data.attacker.name : data.name}
                        </button>
                      </td>
                      <td>
                        {Math.round(
                          data.attacker ? data.attacker.health : data.health
                        )}
                      </td>
                      <td>
                        {damageCauser[data.damageCauserName]
                          ? damageCauser[data.damageCauserName]
                          : data.damageCauserName}
                      </td>
                      <td>{data.damageReason}</td>
                      <td>
                        <button
                          className="buttonlink"
                          onClick={() => {
                            setSeasonDataPlayer(
                              data.attacker ? data.attacker.name : data.name
                            );
                            setAttackerArray(
                              data.victim
                                ? data.victim.name
                                : data.attacker.name
                            );
                            openModal(data.attacker ? data.attacker.name : data.name);
                          }}
                        >
                          {data.victim ? data.victim.name : data.attacker.name}
                        </button>
                      </td>
                      <td>{Math.round(data.damage)}</td>
                      <td>
                        {Math.round(data.victim.health) === 0
                          ? "knock"
                          : data.victim
                          ? `${Math.round(data.victim.health)} to ${
                              Math.round(data.victim.health - data.damage) === 0
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
