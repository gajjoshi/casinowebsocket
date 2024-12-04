import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import screw from "./assets/screw.png";
import a from "./assets/a.png";
import b from "./assets/b.png";
import ocean7 from "./assets/ocean7.png";
import CardFlip from "./components/CardFlip";
import WinnerModal from "./components/WinnerModal";

const Page1 = () => {
  return (
    <div className="h-[92vh] overflow-clip ">
      <JokerAndCards />
      <div className="flex h-[13vh] justify-between   bg-[url('./assets/wood.png')]  shadow-lg border-2 border-yellow-600">
        <BettingSection />
        <Statistics />
        <AndarBaharButtons />
      </div>
    </div>
  );
};

const JokerAndCards = () => {
  const [jokerValue, setJokerValue] = useState(null);
  const isJokerSet = useRef(false); // Ref to track if jokerValue is set
  const [messages, setMessages] = useState([]);
  const [jokercount, setJokercount] = useState([]);



  const [section0Cards, setSection0Cards] = useState([]);
  const [section1Cards, setSection1Cards] = useState([]);
  const [revealedCards, setRevealedCards] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [won, setWon] = useState(-1);
  const [prevId, setPrevId] = useState(0);
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    const ws = new WebSocket("ws://localhost:6789");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Data received from server:", data);
        if (data.action === "add_player") {
          console.log("Updated player list:", data.players);
          // Update your UI with the new player list
        } else if (data.message) {
          console.log(data.message);
        }
        if (data.joker) {
          setJokerValue(data.joker);
          console.log("Updated Joker Value:", data.joker);

          const firstJokerCharacter = data.joker[0];
          console.log("First Character of Joker Value:", firstJokerCharacter);
        }

        const { value, section_id } = data;

        if (section_id === 0) {
          setSection0Cards((prevCards) => [...prevCards, value]);
        } else if (section_id === 1) {
          setSection1Cards((prevCards) => [...prevCards, value]);
        }

        if (data.joker && value && data.joker[0] === value[0]) {
          console.log(`SECTION ID ${section_id} WON:`);
          win_section(section_id)
          console.log(section_id)
          setWon(section_id);
          handleWin();
          win_section(section_id);

          setTimeout(() => {
            setWon(-1);
            handleCloseModal();
            setShowResetPopup(true);
            // window.location.reload();
          }, 7000);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const resetCollections = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const resetMessage = {
        action: "reset_collections",
      };
      socket.send(JSON.stringify(resetMessage));
      console.log("Collections reset.");
    } else {
      console.log("WebSocket connection is not open.");
    }
  };

  const addPlayer = (playerName) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const addPlayerMessage = {
        action: "add_player",
        player: playerName,
      };
      socket.send(JSON.stringify(addPlayerMessage));
      console.log(`Player ${playerName} added.`);
    } else {
      console.log("WebSocket connection is not open.");
    }
  };
  

  const reconnectWebSocket = () => {
    console.log("Reconnecting WebSocket...");
    const newSocket = new WebSocket("ws://localhost:6789");
  
    newSocket.onopen = () => {
      console.log("WebSocket reconnected.");
      setSocket(newSocket); // Update the socket reference
    };
  
    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return newSocket;
  };
  
  const win_section = (section_id) => {
    console.log("inside win section");
  
    // Check if WebSocket connection is open
    if (socket && socket.readyState === WebSocket.OPEN) {
      const winMessage = {
        action: "win_section",
        section_id: section_id,
      };
      socket.send(JSON.stringify(winMessage));
      console.log("win section sent.");
    } else if (socket && socket.readyState === WebSocket.CONNECTING) {
      console.log("WebSocket is still connecting...");
      setTimeout(() => win_section(section_id), 1000); // Retry after 1 second
    } else {
      console.log("WebSocket connection is not open or has closed.");
      // Reconnect WebSocket
      const newSocket = reconnectWebSocket();
  
      // Wait for connection to establish and then proceed
      newSocket.onopen = () => {
        console.log("WebSocket reconnected and now sending win section message...");
        const winMessage = {
          action: "win_section",
          section_id: section_id,
        };
        newSocket.send(JSON.stringify(winMessage));
        console.log("win section sent after reconnect.");
      };
    }
  };
  
  let hasRefreshed = false; // Persistent variable outside the function




  const handleWin = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className="bg-[#8F1504] h-[79vh] p-4 border-8 border-yellow-600">
      <WinnerModal show={showModal} onClose={handleCloseModal} winner={won} />
      <div className="flex items-center justify-center mx-auto border-b-4 border-yellow-600 pb-4 mb-4">
        <div className="text-white ml-2 font-ramaraja text-4xl font-bold">
          JOKER
        </div>
        <div className="w-40 h-[23vh] border-dashed ml-5 border-2 border-yellow-600 bg-[#450A0366] rounded-lg flex justify-center items-center">
          {jokerValue ? (
            <img
              src={`./cards/${jokerValue}.png`}
              alt="Ocean 7 Casino"
              className="h-52"
            />
          ) : (
            <div className="flex justify-center items-center h-52">
              <img src={ocean7} alt="ocean7" className="w-24 h-24" />
            </div>
          )}
        </div>
      </div>

      <div className="flex relative  justify-between p-4 border-b-4 border-yellow-600">
        <div className="text-white font-ramaraja text-6xl mt-10 font-bold mr-4">
          A
        </div>
        <div className="border-dashed border-2 border-yellow-600 rounded-lg w-full h-[20vh] bg-[#450A0366] flex pl-32 items-center justify-left">
          {section0Cards.length > 0 &&
            section0Cards.map((card, index) => (
              <CardFlip
                key={index}
                index={index}
                frontImage={`./cards/${card}.png`}
                list={section0Cards}
                isRevealed={revealedCards[card] || true}
                frontContent={`Card ${card}`}
              />
            ))}
        </div>
      </div>

      <div className="flex  justify-center p-4">
        <div className="text-white font-ramaraja text-6xl mt-10 font-bold mr-4">
          B
        </div>
        <div className="border-dashed border-2 border-yellow-600 rounded-lg w-full h-[20vh] bg-[#450A0366] flex pl-32 items-center justify-left">
          {section1Cards.length > 0 &&
            section1Cards.map((card, index) => (
              <CardFlip
                key={index}
                index={index}
                frontImage={`./cards/${card}.png`}
                list={section1Cards}
                isRevealed={revealedCards[card] || true}
                frontContent={`Card ${card}`}
              />
            ))}
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
          <p className="text-lg">MAX: {maxBet}</p>
          <p className="text-lg">MIN: {minBet}</p>
        </div>
      </div>
    </div>
  );
};

const Statistics = () => {
  const [recentWins, setRecentWins] = useState([]);
  const [winPercentages, setWinPercentages] = useState({});

  useEffect(() => {
    // Fetch data from the API
    const fetchRecentWins = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/myapp/api/get_recent_wins/"
        );
        const data = await response.json();

        if (data.success) {
          const wins = data.recent_wins.reverse().slice(0, 50);
          setRecentWins(wins);
          console.log("Recent Wins:", wins);

          const sectionWins = wins.reduce((acc, win) => {
            acc[win.section_id] = (acc[win.section_id] || 0) + 1;
            return acc;
          }, {});

          const totalWins = wins.length;
          const percentages = {};

          for (const [sectionId, count] of Object.entries(sectionWins)) {
            percentages[sectionId] = ((count / totalWins) * 100).toFixed(2);
          }

          setWinPercentages(percentages); // Store win percentages in state
          console.log("Win Percentages:", percentages);
        }
      } catch (error) {
        console.error("Error fetching recent wins:", error);
      }
    };

    // Rendering the percentages
    // return (
    //   <div>
    //     {Object.entries(winPercentages).map(([sectionId, percentage]) => (
    //       <div key={sectionId}>
    //         Section {sectionId}: {percentage}%
    //       </div>
    //     ))}
    //   </div>
    // );
    console.log(winPercentages);
    fetchRecentWins();
  }, []);
  return (
    <div className="  text-[#f3be39] p-4 border-2 border-gray-400 shadow-lg w-2/4">
      <div className="text-center font-ramaraja text-4xl font-bold ">
        STATISTICS
      </div>
      {/* <div className="flex relative justify-center h-16 items-center space-x-2">
        <span className="absolute text-xs  top-2.5 left-40">
          {winPercentages[0]}
        </span>
        <img
          src={stat}
          alt="stats"
          className="w-[60%]  mt-[-10px]"
          // className="absolute left-1/2  transform -translate-x-1/2  h-24 mx-auto"
        />
        <span className="absolute text-xs  top-2.5 right-40">
          {winPercentages[1]}
        </span>
      </div> */}
      <div className="flex justify-center items-center overflow-clip -mt-5 space-x-2 bg-brown-800 p-4 rounded-lg">
        {/* A Coin Side */}
        <div className="flex justify-center items-center w-[100%] relative">
          <div className="absolute -mt-2 ml-2 left-0 w-16 h-20 overflow-clip">
            <img src={a} alt="a" className="w-16 " />
          </div>
          <div
            style={{ width: `${winPercentages[0] - 20}%` }}
            className="flex w-[30%] border-4 border-yellow-400  items-center space-x-2 bg-red-700 rounded px-2 py-1"
          >
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400 font-semibold">
                {Math.round(winPercentages[0])}
              </span>
            </div>
          </div>

          {/* B Coin Side */}
          <div className="absolute mr-2 -mt-2 right-0 w-16 h-20 pt-1 overflow-clip">
            <img src={b} alt="b" className="w-16 " />
          </div>
          <div
            style={{ width: `${winPercentages[1] - 20}%` }}
            className="flex w-[30%] border-4 border-yellow-400 justify-end items-center space-x-2 bg-blue-700 rounded px-2 py-1"
          >
            <div className="flex items-center justify-end space-x-1">
              <div className="text-yellow-400  font-semibold">
                {Math.round(winPercentages[1])}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AndarBaharButtons = () => {
  return (
    <div className="flex relative font-questrial justify-center items-center space-x-6 w-1/4">
      <img src={screw} alt="screw" className="absolute top-2 left-2 w-8 h-8" />
      <img src={screw} alt="screw" className="absolute top-2 right-2 w-8 h-8" />

      <div className="flex flex-col items-center">
        <div className="w-12 h-16 overflow-clip">
          <img src={a} alt="a" className="w-12 " />
        </div>
        <div className="text-[#f3be39] text-2xl font-semibold">Andar</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-12 h-16 pt-1 overflow-clip">
          <img src={b} alt="b" className="w-12 " />
        </div>
        <div className="text-[#f3be39]  text-2xl font-semibold">Bahar</div>
      </div>
    </div>
  );
};

export default Page1;