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

  const [section0Cards, setSection0Cards] = useState([]);
  const [section1Cards, setSection1Cards] = useState([]);
  const [revealedCards, setRevealedCards] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [won, setWon] = useState(-1);
  const [prevId, setPrevId] = useState(0);
  const fetchJokerValue = () => {
    // if (isJokerSet.current) return; // Stop if jokerValue is already set

    axios
      .get("http://127.0.0.1:8000/myapp/api/get_joker_value/")
      .then((response) => {
        const { value } = response.data.data;

        if (value) {
          setJokerValue(value);
          console.log("joker found:,", value); // Set the joker value
          isJokerSet.current = true; // Mark as set
        } else {
          // Retry after a delay if value is empty
          setTimeout(fetchJokerValue, 1000);
        }
      })
      .catch((error) => {
        // Handle errors and retry after a delay
        setTimeout(fetchJokerValue, 2000);
      });
  };

  useEffect(() => {
    fetchJokerValue(); // Initial fetch call
  }, []);
  let hasRefreshed = false; // Persistent variable outside the function

  const fetchCardData = async (method, cardValue) => {
    try {
      const config = {
        url: "http://127.0.0.1:8000/myapp/api/assign_card_to_section_A/",
        method: method,
        headers: {
          "Content-Type": "application/json", // Specify content type
        },
        data: cardValue, // Example body to send with the request
      };

      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: JSON.stringify(config.data), // Stringify the data
      });
      const responseData = await response.json();
      console.log("responseData", responseData);
      if (responseData.error === "No documents found in MongoDB") {
        console.log("in no doc");
        if (!hasRefreshed) {
          console.error("Error: No documents found in MongoDB");
          hasRefreshed = true;
          setTimeout(() => {
            window.location.reload(); // Reload after a delay
          }, 5000); // Set the flag to prevent further reloads
          // window.location.reload(); // Reload only once
        }
      }
      if (response.ok) {
        if (responseData.success) {
          const { value, section_id, current_id, result, update } =
            responseData;
          console.log("response", responseData);

          if (update === 0) {
            setPrevId((prev) => {
              if (prev !== current_id) {
                console.log("current_id:", current_id);

                if (section_id === 0) {
                  setSection0Cards((prevCards) => {
                    const updatedCards = [...prevCards, value];
                    console.log("Updated section0Cards", updatedCards);
                    return updatedCards;
                  });
                } else if (section_id === 1) {
                  setSection1Cards((prevCards) => {
                    const updatedCards = [...prevCards, value];
                    console.log("Updated section1Cards", updatedCards);
                    return updatedCards;
                  });
                }

                return prev + 1;
              } else {
                console.log("Card already read, no update.");
                return prev;
              }
            });
          }

          if (update === 1) {
            console.log("inside put");
            setPrevId((prev) => {
              if (section_id === 0) {
                setSection0Cards((prevCards) => {
                  const updatedCards = [...prevCards];
                  updatedCards.pop();
                  updatedCards.push(value);
                  console.log("Updated section0Cards", updatedCards);
                  return updatedCards;
                });
              } else if (section_id === 1) {
                setSection1Cards((prevCards) => {
                  const updatedCards = [...prevCards];
                  updatedCards.pop();
                  updatedCards.push(value);
                  console.log("Updated section1Cards", updatedCards);
                  return updatedCards;
                });
              }

              return prev;
            });
          }

          console.log("result", result);

          if (result === "0 wins") {
            setWon(0);
            handleWin();
            setTimeout(() => {
              setWon(-1);
              handleCloseModal();
              window.location.reload();
            }, 5000);
          } else if (result === "1 wins") {
            setWon(1);
            handleWin();
            setTimeout(() => {
              setWon(-1);
              handleCloseModal();
              window.location.reload();
            }, 5000);
          }
        }
      }
    } catch (error) {
      console.error("Error handling card operation:", error);
    }
  };

  const revealCard = (card, section) => {
    setRevealedCards((prev) => ({ ...prev, [card]: true }));
    setTimeout(() => {
      setRevealedCards((prev) => ({ ...prev, [card]: false }));
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCardData("POST");
    }, 500);
    return () => clearInterval(interval);
  }, []);

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