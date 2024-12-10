import PlayerPage from "./PlayerPage";

const Page4 = () => {

  return (

    <div className="min-h-screen bg-brown-700 ">
      <PlayerHeader />
      <PlayerPage playerName="player4" />
    </div>

  );
};

const PlayerHeader = () => {
  return (
    <div className="flex h-[8vh] bg-[url('./assets/wood.png')] justify-center items-center py-4">
      <div className="bg-[#911606] text-white text-2xl font-bold px-8 py-2 rounded-full border-4 font-ramaraja border-yellow-600">
        Player 4
      </div>
    </div>
  );
};

export default Page4;
