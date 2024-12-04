import { useState } from "react";
import Page1 from "./Page1";

const PlayerPage = ({ playerName }) => {
  const [playerStatus, setPlayerStatus] = useState(0); // Default status is 0

  const handleStatusChange = (status) => {
    setPlayerStatus(status); // Update status when notified by Page1
  };

  return (
    <div className="min-h-screen bg-brown-700">
         
<Page1 playerName={playerName} onStatusChange={handleStatusChange} />

      {playerStatus === 0 ? (
        <div className="text-center text-white">
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/video/ocean7vid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          

        </div>
      ) : (
        <div>
          {/* Render actual page functionality for the player */}
          

        </div>
      )}
    </div>
  );
};

export default PlayerPage;
