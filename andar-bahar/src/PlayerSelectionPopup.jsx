import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePlayerContext } from "./context/PlayerContext";

const PlayerSelectionPopup = ({ setShowPopup }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [currentPlayers, setCurrentPlayers] = useState([]);

  const players = ["page1", "page2", "page3", "page4", "page5", "page6"];

  // const fetchCurrentPlayers = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://127.0.0.1:8000/myapp/api/player-round/"
  //     );
  //     setCurrentPlayers(response.data.current_players);
  //   } catch (error) {
  //     console.error("Error fetching current players:", error);
  //   }
  // };
  const { fetchCurrentPlayers } = usePlayerContext();

  const submitPlayers = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/myapp/api/player-round/", {
        players: selectedPlayers,
      });
      setShowPopup(false);
      fetchCurrentPlayers();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting players:", error);
    }
  };
  

  useEffect(() => {
    fetchCurrentPlayers();
  }, []);

  return (
    <div className="absolute top-0 right-0 flex items-center justify-center bg-black ">
      <div className="bg-[#971909] text-yellow-300 border-2 border-[#D6AB5D] shadow-lg p-6 rounded w-60">
        <h2 className="text-xl font-bold mb-4 text-center">Choose Player(s)</h2>

        <div className="flex flex-col space-y-2 mb-4">
          {players.map((player) => (
            <label
              key={player}
              className="flex items-center space-x-2 p-2 bg-[#450A0366] rounded border border-yellow-600"
            >
              <input
                type="checkbox"
                value={player}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPlayers([...selectedPlayers, player]);
                  } else {
                    setSelectedPlayers(
                      selectedPlayers.filter((p) => p !== player)
                    );
                  }
                }}
                className="form-checkbox text-[#D6AB5D] bg-gray-800"
              />
              <span>{player}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setShowPopup(false)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={submitPlayers}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionPopup;
