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
  
    ws.onmessage = (event) => {
      try {
        // Parse incoming WebSocket message
        const data = JSON.parse(event.data);
        console.log("Data received from server:", data);
  
        // Update Joker value if present
        if (data.joker) {
          setJokerValue(data.joker);
          console.log("Updated Joker Value:", data.joker);
  
          // Extract and save the first character of joker
          const firstJokerCharacter = data.joker[0];
          console.log("First Character of Joker Value:", firstJokerCharacter);
          setJokercount(firstJokerCharacter);
        }
  
        // Handle general messages
        if (data.message) {
          setMessages((prevMessages) => [...prevMessages, data.message]);
        }
  
        // Destructure values from the incoming data
        const { value, section_id, current_id } = data;
  
        // Log the card value
        if (value) {
          console.log("Card Value:", value);
        }
  
        // Handle incoming card data for Section 0
        if (section_id === 0) {
          setSection0Cards((prevCards) => {
            const updatedCards = [...prevCards, value];
            console.log("Updated Section 0 Cards:", updatedCards);
            return updatedCards;
          });
        }
  
        // Handle incoming card data for Section 1
        if (section_id === 1) {
          setSection1Cards((prevCards) => {
            const updatedCards = [...prevCards, value];
            console.log("Updated Section 1 Cards:", updatedCards);
            return updatedCards;
          });
        }

        
  
        // Check if Joker and Card values match
        if (data.joker && value && data.joker[0] === value[0]) {
          win_section(section_id)
          console.log(`SECTION ID ${section_id} WON:`);
  
          // Update state and handle win
          setWon(section_id);
          handleWin();
          resetCollections();
  
          // Delay reset and reload
          setTimeout(() => {
            setWon(-1);
            handleCloseModal();
            


            window.location.reload();
          }, 7000);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
  
    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  
    // Save WebSocket reference
    setSocket(ws);
  
    // Cleanup WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);
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
      <img src={ocean7} alt="ocean7" className="w-12 h-12 p-1" />
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
    <div className="bg-[#971909] h-[79%] relative">
      <WinnerModal show={showModal} onClose={handleCloseModal} winner={won} />
      <div
        className="absolute  inset-0 bg-contain bg-no-repeat bg-center opacity-50"
        style={{ backgroundImage: `url(${ocean7})` }}
      ></div>
      {/* <img
        src={sidelogo}
        alt="sidelogo"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[80%] ml-[-30px]"
      />
      <img
        src={sidelogo}
        alt="sidelogo"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-[80%]"
      /> */}
      <div className="w-full  max-w-full mx-auto p-4">
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
        <p className="text-3xl font-bold font-ramaraja ">Bets</p>
        <div className="flex-col items-start justify-start">
          <p className="text-lg">Max:{maxBet}</p>
          <p className="text-lg">Min: {minBet}</p>
        </div>
      </div>
    </div>
  );
};
const Statistics = ({ winPercentages }) => {
  return (
    <div className="  text-[#f3be39] p-4 border-2 border-gray-400 shadow-lg w-2/4">
      <div className="text-center font-ramaraja text-4xl font-bold ">
        STATISTICS
      </div>
      {/* <div className="flex relative justify-center h-16 items-center space-x-2">
        <span className="absolute text-xs  top-2 left-40">
          {winPercentages[1]}
        </span>
        <img
          src={stat}
          alt="stat"
          className="w-[70%]  mt-[-10px]"
          // className="absolute left-1/2  transform -translate-x-1/2  h-24 mx-auto"
        />
        <span className="absolute text-xs  top-2 right-40">
          {winPercentages[1]}
        </span>
      </div> */}
      <div className="flex justify-center items-center overflow-clip -mt-5 space-x-2 bg-brown-800 p-4 rounded-lg">
        {/* A Coin Side */}
        <div className="flex justify-center items-center w-[70%] relative">
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
