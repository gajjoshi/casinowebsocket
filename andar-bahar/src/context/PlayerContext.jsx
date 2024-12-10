// context/PlayerContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentPlayers, setCurrentPlayers] = useState([]);

  // Function to fetch the current players list
  const fetchCurrentPlayers = async () => {
    try {
      const response = await axios.get("http://192.168.1.100:8000/myapp/api/player-round/");
      setCurrentPlayers(response.data.current_players || []);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  };

  // Fetch players once when the app loads
  useEffect(() => {
    fetchCurrentPlayers();
  }, []);

  return (
    <PlayerContext.Provider value={{ currentPlayers, fetchCurrentPlayers }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
