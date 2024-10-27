import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayerSelectionPopup = ({ setShowPopup }) => {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [currentPlayers, setCurrentPlayers] = useState([]);

    const players = ["page1", "page2", "page3","page4","page5","page6"];

    const fetchCurrentPlayers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/myapp/api/player-round/');
            setCurrentPlayers(response.data.current_players);
        } catch (error) {
            console.error("Error fetching current players:", error);
        }
    };

    const submitPlayers = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/myapp/api/player-round/', {
                players: selectedPlayers
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
    // useEffect(() => {
    //     if (submitPlayers) {
    //       window.location.reload();
    //     }
    //   }, [submitPlayers]);
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-lg font-bold mb-4">Choose Player(s)</h2>
                <div className="flex flex-col space-y-2">
                    {players.map((player) => (
                        <label key={player} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={player}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedPlayers([...selectedPlayers, player]);
                                    } else {
                                        setSelectedPlayers(selectedPlayers.filter(p => p !== player));
                                    }
                                }}
                            />
                            <span>{player}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button onClick={submitPlayers} className="bg-green-500 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerSelectionPopup;
// {
//     "players": ["page1"]
// }