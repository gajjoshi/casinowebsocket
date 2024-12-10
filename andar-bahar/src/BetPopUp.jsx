import React, { useState, useEffect } from "react";

const BetPopUp = ({ setShowBet }) => {
  const [minBet, setMinBet] = useState("");
  const [maxBet, setMaxBet] = useState("");
  const [currentBets, setCurrentBets] = useState({ min: "", max: "" });

  const fetchBets = async () => {
    try {
      const response = await fetch("http://192.168.1.100:8000/myapp/api/get-bet/");
      const data = await response.json();
      if (response.ok) {
        setCurrentBets(data);
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.1.100:8000/myapp/api/set-bet/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ min_bet: minBet, max_bet: maxBet }),
      });
      if (response.ok) {
        alert("Bets set successfully!");
        fetchBets(); // Refresh bets after setting
        setShowBet(false); // Close popup after submitting
      } else {
        alert("Failed to set bets.");
      }
    } catch (error) {
      console.error("Error setting bets:", error);
    }
  };

  useEffect(() => {
    fetchBets(); // Fetch bets when the popup is opened
  }, []);

  return (
    <div className="absolute top-0 right-0 flex items-center justify-center bg-black  ">
      <div className="bg-[#971909] text-yellow-300 border-2 border-[#D6AB5D] shadow-lg p-6 rounded w-60">
        <h2 className="text-xl font-bold mb-4 text-center">Set Bets</h2>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Min Bet:</label>
          <input
            type="number"
            value={minBet}
            onChange={(e) => setMinBet(e.target.value)}
            className="w-full p-2 border rounded bg-[#450A0366] text-yellow-300 border-yellow-600 focus:outline-none"
            placeholder="Enter min bet"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Max Bet:</label>
          <input
            type="number"
            value={maxBet}
            onChange={(e) => setMaxBet(e.target.value)}
            className="w-full p-2 border rounded bg-[#450A0366] text-yellow-300 border-yellow-600 focus:outline-none"
            placeholder="Enter max bet"
          />
        </div>

        <div className="flex justify-between gap-2 mt-4">
          <button
            onClick={handleSubmit}
            className="w-1/2 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Set Bet
          </button>
          <button
            onClick={fetchBets}
            className="w-1/2 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Fetch Bets
          </button>
        </div>

        <div className="mt-4 text-sm">
          <p>Current Min Bet: {currentBets.min_bet}</p>
          <p>Current Max Bet: {currentBets.max_bet}</p>
        </div>

        <button
          onClick={() => setShowBet(false)}
          className="mt-4 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BetPopUp;
