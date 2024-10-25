import React from "react";

const Page3 = () => {
  return (
    <div className="min-h-screen bg-brown-700 ">
      <PlayerHeader />
      <JokerAndCards />
      <BetsAndStatistics />
    </div>
  );
};

const PlayerHeader = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="bg-red-700 text-white text-xl font-bold px-8 py-2 rounded-full border-2 border-yellow-600">
        Player 1
      </div>
    </div>
  );
};

const JokerAndCards = () => {
  return (
    <div className="bg-red-700 rounded-lg p-4 border-8 border-yellow-600">
      {/* Joker Section */}
      <div className="flex justify- ml-5 items-center border-b-2 border-yellow-600 pb-4 mb-4">
        <div className="text-white text-4xl font-bold">JOKER</div>
        <div className="w-40 h-60 border-dashed ml-5 border-4 border-yellow-600 bg-red-800 rounded-lg flex justify-center items-center">
          <img
            src="/path-to-ocean7-logo.png" // Add logo here
            alt="Ocean 7 Casino"
            className="w-20"
          />
        </div>
      </div>

      {/* A Section */}
      <div className="flex justify- ml-5 items-center border-b-2 border-yellow-600 pb-4 mb-4">
        <div className="text-white text-4xl font-bold">A</div>
        <div className="w-40 h-60 border-dashed ml-5 border-4 border-yellow-600 bg-red-800 rounded-lg"></div>
      </div>

      {/* B Section */}
      <div className="flex justify- ml-5 items-center">
        <div className="text-white text-4xl font-bold">B</div>
        <div className="w-40 h-60 border-dashed ml-5 border-4 border-yellow-600 bg-red-800 rounded-lg"></div>
      </div>
    </div>
  );
};

const BetsAndStatistics = () => {
  return (
    <div className="mt-8 bg-brown-900 p-4 rounded-lg border-2 border-yellow-600">
      <div className="flex justify-between">
        {/* Bets Section */}
        <div className="text-yellow-300 text-left font-semibold">
          <p className="text-xl font-bold">Bets</p>
          <p>Max: 20,000</p>
          <p>Min: 1,000</p>
        </div>

        {/* Statistics Section */}
        <div className="text-center text-yellow-300 font-bold">
          <div className="text-2xl mb-2">STATISTICS</div>
          <div className="flex items-center space-x-2">
            <div className="bg-red-700 text-white rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold shadow-md">
              A
            </div>
            <div className="flex items-center">
              <div className="bg-red-600 h-8 w-24 flex items-center rounded-l-full">
                <div className="bg-yellow-400 h-full w-1/2"></div>
              </div>
              <div className="bg-blue-600 h-8 w-24 flex items-center rounded-r-full">
                <div className="bg-blue-400 h-full w-1/2"></div>
              </div>
            </div>
            <div className="bg-blue-700 text-white rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold shadow-md">
              B
            </div>
          </div>
        </div>

        {/* Andar / Bahar Buttons */}
        <div className="flex space-x-4 items-center">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
              A
            </div>
            <div className="text-yellow-300 font-semibold">Andar</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
              B
            </div>
            <div className="text-yellow-300 font-semibold">Bahar</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page3;
