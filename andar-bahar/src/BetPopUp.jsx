import React, { useState, useEffect } from 'react';

const BetPopUp = ({ setShowBet }) => {
  const [minBet, setMinBet] = useState('');
  const [maxBet, setMaxBet] = useState('');
  const [currentBets, setCurrentBets] = useState({ min: '', max: '' });

  const fetchBets = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/myapp/api/get-bet/');
      const data = await response.json();
      if (response.ok) {
        setCurrentBets(data);
      }
    } catch (error) {
      console.error('Error fetching bets:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/myapp/api/set-bet/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ min_bet: minBet, max_bet: maxBet }),
      });
      if (response.ok) {
        alert('Bets set successfully!');
        fetchBets(); // Refresh bets after setting
        setShowBet(false); // Close popup after submitting
      } else {
        alert('Failed to set bets.');
      }
    } catch (error) {
      console.error('Error setting bets:', error);
    }
  };

  useEffect(() => {
    fetchBets(); // Fetch bets when the popup is opened
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Set Bets</h2>
        <div className="mb-4">
          <label className="block mb-1">Min Bet:</label>
          <input
            type="number"
            value={minBet}
            onChange={(e) => setMinBet(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter min bet"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Max Bet:</label>
          <input
            type="number"
            value={maxBet}
            onChange={(e) => setMaxBet(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter max bet"
          />
        </div>
        <div className="flex justify-between">
          <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded">
            Set Bet
          </button>
          <button onClick={() => {
            fetchBets(); // Fetch bets when clicking the button
          }} className="bg-green-500 py-2 px-4 rounded">
            Fetch Bets
          </button>
        </div>
        <div className="mt-4">
          <p>Current Min Bet: {currentBets.min_bet}</p>
          <p>Current Max Bet: {currentBets.max_bet}</p>
        </div>
        <button onClick={() => setShowBet(false)} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default BetPopUp;
