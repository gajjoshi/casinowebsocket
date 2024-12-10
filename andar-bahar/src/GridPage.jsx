import React from "react";
import Page1 from "./Page1"
import ocean7 from "./assets/ocean7.png";
import logo from "./assets/logo.png";
import a from "./assets/a.png";
import b from "./assets/b.png";
import screw from "./assets/screw.png";
import { useEffect, useState } from "react";
import WinnerModal from "./components/WinnerModal";

const GridPage = () => {
  const [winPercentages, setWinPercentages] = useState({});
  const [jokerValue, setJokerValue] = useState(null);
  const [socket, setSocket] = useState(null);



  useEffect(() => {
    const ws = new WebSocket("ws://localhost:6789");
  
    const setupWebSocket = (socket) => {
      socket.onopen = () => {
        console.log("WebSocket connected.");
        setSocket(socket); // Save the active socket instance
      };
  
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Data received from server:", data);
  
          // Handle Joker updates
          if (data.joker) {
            setJokerValue(data.joker);
            console.log("Updated Joker Value:", data.joker);
          } else if (jokerValue) {
            console.log("JOKER RESET");
            setJokerValue(null);
          }
  
          // Handle reset action
          if (data.action === "reset_collections") {
            console.log("Reset action received. Reloading...");
            window.location.reload();
          }
  
          // Handle other messages
          if (data.message) {
            setMessages((prev) => [...prev, data.message]);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };
  
      socket.onclose = () => {
        console.log("WebSocket connection closed. Attempting to reconnect...");
        setTimeout(reconnectWebSocket, 3000); // Attempt reconnection after 3 seconds
      };
  
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };
  
    // Initial WebSocket setup
    setupWebSocket(ws);
  
    // Cleanup function
    return () => {
      console.log("Cleaning up WebSocket...");
      ws.close();
    };
  }, [jokerValue]);
  
  const reconnectWebSocket = () => {
    console.log("Reconnecting WebSocket...");
    const newSocket = new WebSocket("ws://localhost:6789");
    setupWebSocket(newSocket);
  };
  
  if (jokerValue) {
    // Render only the "Joker Value Set" message
    return (
      <div>
        <Page1 />
      </div>
    );
  }
  return (
    <div className="h-screen bg-yellow-400">
      <div className="bg-yellow-400 px-2 h-[75%] pt-1 text-center">
        <div className="bg-yellow-200 px-4 pt-2 h-full text-center shadow-lg rounded-lg">
          <Header />
          <GameGrid
            winPercentages={winPercentages}
            setWinPercentages={setWinPercentages}
          />
        </div>
      </div>
      <div className="flex h-[20%] justify-between bg-[url('./assets/wood.png')]  shadow-lg border-2 border-yellow-600">
        <BettingSection />
        <Statistics winPercentages={winPercentages} />
        <AndarBaharButtons />
      </div>
      <Footer />
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex justify-between items-center py-5 px-10  bg-[url('./assets/wood.png')] relative font-questrial">
      <img src={ocean7} alt="ocean7" className="w-20 h-20 p-1" />
      <img
        src={logo}
        alt="logo"
        className="absolute left-1/2 mt-2 z-20 transform -translate-x-1/2 h-40"
      />
      <div className="text-3xl  text-yellow-300">
        Table <br></br> 1234
      </div>
    </div>
  );
};

const GameGrid = ({ winPercentages, setWinPercentages }) => {
  const [recentWins, setRecentWins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [won, setWon] = useState(-1);
  const [winsLength, setWinsLength] = useState(null);
  useEffect(() => {
    // Fetch data from the API
    const fetchRecentWins = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/myapp/api/get_recent_wins/"
        );
        const data = await response.json();

        if (data.success) {
          const wins = data.recent_wins.reverse().slice(0, 70);
          setRecentWins(wins);

          const sectionWins = wins.reduce((acc, win) => {
            acc[win.section_id] = (acc[win.section_id] || 0) + 1;
            return acc;
          }, {});
          if (
            winsLength !== null &&
            winsLength < wins.length &&
            wins.length > 0
          ) {
            setWon(wins[wins.length - 1].section_id);
            handleWin();
          }
          const totalWins = wins.length;
          setWinsLength(totalWins);
          const percentages = {};

          for (const [sectionId, count] of Object.entries(sectionWins)) {
            percentages[sectionId] = ((count / totalWins) * 100).toFixed(2);
          }

          setWinPercentages(percentages); // Store win percentages in state
        }
      } catch (error) {
        console.error("Error fetching recent wins:", error);
      }
    };

    fetchRecentWins();
    const intervalId = setInterval(fetchRecentWins, 10000);

    return () => clearInterval(intervalId);
  }, []);
  

  // Function to group consecutive tokens
  const groupConsecutiveTokens = (wins) => {
    const groups = [];
    let currentGroup = [];
    let prevSectionId = null;

    wins.forEach((win) => {
      if (win.section_id === prevSectionId || prevSectionId === null) {
        // Same section_id, add to current group
        currentGroup.push(win);
      } else {
        // Different section_id, push current group and start a new one
        groups.push(currentGroup);
        currentGroup = [win];
      }
      prevSectionId = win.section_id;
    });

    // Push the last group if not empty
    if (currentGroup.length) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const renderGrid = () => {
    const groups = groupConsecutiveTokens(recentWins);
    let colIndex = 0;

    return groups.map((group, groupIndex) => {
      const rowItems = group.map((win, rowIndex) => (
        <div key={rowIndex} className="w-16 h-16 rounded-full">
          {win.section_id === 0 ? (
            <img src={a} alt="Image A" className="w-16 mb-3" />
          ) : (
            <img src={b} alt="Image B" className="w-16 mb-3" />
          )}
        </div>
      ));

      const style = {
        gridColumn: colIndex + 1, // Place the group in the current column
        gridRowStart: 1, // Start from the first row
        gridRowEnd: `span ${group.length}`, // Span as many rows as there are items
      };

      // Move to the next column for the next group
      colIndex++;

      return (
        <div
          key={groupIndex}
          style={style}
          className="flex flex-col justify-start items-center "
        >
          {rowItems}
        </div>
      );
    });
  };
  const handleWin = () => {
    setShowModal(true);
    setTimeout(() => {
      setWon(-1);
      // handleCloseModal();
      // window.location.reload();
    }, 5000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-[#971909] h-[83%] relative   ">
      <WinnerModal show={showModal} onClose={handleCloseModal} winner={won} />
      <div
        className="absolute  inset-0 bg-contain bg-no-repeat bg-center opacity-50 animate-glow"
        style={{ backgroundImage: `url(${ocean7})` }}
      ></div>
      <div className="w-full  max-w-full mx-auto p-4 relative z-10">
        {/* Centering the grid and adjusting the gaps */}
        <div className="grid grid-cols-10 gap-x-8 gap-y-4 justify-center ">
          {renderGrid()}
        </div>
      </div>
    </div>
  );
};

const BettingSection = () => {
  const [minBet, setMinBet] = useState(null);
  const [maxBet, setMaxBet] = useState(null);
  const [newMinBet, setNewMinBet] = useState("");
  const [newMaxBet, setNewMaxBet] = useState("");

  // Fetch current bets when the component mounts
  useEffect(() => {
    getBet();
  }, []);
  const getBet = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/myapp/api/get-bet/");
      const data = await response.json();
      if (response.ok) {
        setMinBet(data.min_bet);
        setMaxBet(data.max_bet);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching bet data:", error);
    }
  };
  return (
    <div className="font-questrial p-4 rounded-lg  shadow-lg text-left w-1/4 relative">
      <img src={screw} alt="screw" className="absolute top-2 left-2 w-8 h-8" />
      <img src={screw} alt="screw" className="absolute top-2 right-2 w-8 h-8" />
      <div className="text-[#f3be39] text-center font-semibold">
        <p className="text-3xl font-bold font-ramaraja ">BETS</p>
        <div className="flex-col items-start justify-start">
          <p className="text-3xl font-ramaraja">MAX : {maxBet}</p>
          <p className="text-3xl font-ramaraja">MIN : {minBet}</p>
        </div>
      </div>
    </div>
  );
};
const Statistics = ({ winPercentages }) => {
  return (
    <div className="text-[#f3be39] p-4 border-2 border-gray-400 shadow-lg w-3/4">
    <div className="text-center font-ramaraja text-4xl font-bold">STATISTICS</div>
    <div className="flex justify-center items-center -mt-5 space-x-2 bg-brown-800 p-4 rounded-lg">
      {/* A Coin Side */}
      <div className="flex justify-center items-center w-full relative">
        <div className="absolute -mt-2 left-0 w-16 h-20 overflow-hidden">
          <img src={a} alt="a" className="w-16" />
        </div>
        <div
          style={{ width: `${winPercentages[0]}%` }}
          className="flex border-4 border-yellow-400 items-center space-x-2 bg-red-700 rounded px-2 py-1 ml-20"
        >
          <span className="text-yellow-400 font-semibold">
            {Math.round(winPercentages[0])}%
          </span>
        </div>
        {/* Spacer */}
        <div className="w-4"></div>
        {/* B Coin Side */}
        <div
          style={{ width: `${winPercentages[1]}%` }}
          className="flex border-4 border-yellow-400 justify-end items-center mr-20 bg-blue-700 rounded px-2 py-1"
        >
          <span className="text-yellow-400 font-semibold">
            {Math.round(winPercentages[1])}%
          </span>
        </div>
        <div className="absolute -mt-2 right-0 w-16 h-20 overflow-hidden">
          <img src={b} alt="b" className="w-16" />
        </div>
      </div>
    </div>
  </div>  );
};

const AndarBaharButtons = () => {
  return (
    <div className="flex relative font-questrial justify-center items-center space-x-6 w-1/4">
      <img src={screw} alt="screw" className="absolute top-2 left-2 w-8 h-8" />
      <img src={screw} alt="screw" className="absolute top-2 right-2 w-8 h-8" />

      <div className="flex flex-col items-center">
        <div className="w-16 h-20 overflow-clip">
          <img src={a} alt="a" className="w-16 " />
        </div>
        <div className="text-[#f3be39] mt-2 text-2xl font-semibold">Andar</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-16 h-20 pt-1 overflow-clip">
          <img src={b} alt="b" className="w-16 " />
        </div>
        <div className="text-[#f3be39] mt-2 text-2xl font-semibold">Bahar</div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="   bg-[#D6AB5D] p-1  font-bold font-questrial text-center">
      This is the result display screen. All table results and management's
      decision will be final.
    </div>
  );
};

export default GridPage;
