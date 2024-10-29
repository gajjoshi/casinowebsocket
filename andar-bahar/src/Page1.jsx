import React, { useEffect, useState } from "react";
import axios from "axios";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import screw from "./assets/screw.png";
import logo from "./assets/logo.png";
import menu from "./assets/menu.png";
import redhat from "./assets/redhat.png";
import whitehat from "./assets/whitehat.png";
import sidelogo from "./assets/sidelogo.png";
import a from "./assets/a.png";
import b from "./assets/b.png";
import ocean7 from "./assets/ocean7.png";
import stat from "./assets/stat2.png";
import CardFlip from "./components/CardFlip";
const Page1 = () => {
  const { width, height } = useWindowSize();

  return (
    <div className=" ">
      <JokerAndCards />
      <div className="flex justify-between   bg-[url('./assets/wood.png')]  shadow-lg border-2 border-yellow-600">
        <BettingSection />
        <Statistics />
        <AndarBaharButtons />
      </div>
    </div>
  );
};

const JokerAndCards = () => {
  // State to store the joker card value
  const [jokerValue, setJokerValue] = useState(null);

  // Function to fetch the joker value from the backend
  const fetchJokerValue = () => {
    axios
      .get("http://127.0.0.1:8000/myapp/api/get_joker_value/")
      .then((response) => {
        const { value } = response.data.data;

        // If the value is not empty, set the joker value
        if (value) {
          setJokerValue(value); // Example: "6H"
        } else {
          // Retry after a delay if value is empty
          setTimeout(fetchJokerValue, 500); // Retry every 3 seconds
        }
      })
      .catch((error) => {
        console.error("Error fetching joker value:", error);
        // Retry after a delay in case of error
        setTimeout(fetchJokerValue, 500); // Retry every 3 seconds
      });
  };

  // Fetch the joker value on component mount
  useEffect(() => {
    fetchJokerValue();
  }, []);

  const [showConfetti, setShowConfetti] = useState(false);

  const [latestCard, setLatestCard] = useState(null); // State to store the latest card
  const [section0Cards, setSection0Cards] = useState([]); // State to store history of section 0 cards
  const [section1Cards, setSection1Cards] = useState([]);
  const [revealedCards, setRevealedCards] = useState({});

  const fetchCardData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/myapp/api/assign_card_to_player/"
      );
      if (response.data) {
        const newCard = response.data.value;
        const sectionId = response.data.section_id;

        // setSectionId(sectionId);

        if (sectionId === 0) {
          setSection0Cards((prev) => [...prev, newCard]);
          revealCard(newCard, "section0");
        } else if (sectionId === 1) {
          setSection1Cards((prev) => [...prev, newCard]);
          revealCard(newCard, "section1");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const revealCard = (card, section) => {
    setRevealedCards((prev) => ({ ...prev, [card]: true }));
    setTimeout(() => {
      setRevealedCards((prev) => ({ ...prev, [card]: false }));
    }, 500); // Adjust timing as needed
  };
  useEffect(() => {
    // Fetch the data every 5 seconds
    const intervalId = setInterval(fetchCardData, 500);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#8F1504] p-4 border-8 border-yellow-600">
      {/* Joker Section */}
      <div className="flex  items-center border-b-4 border-yellow-600 pb-4 mb-4">
        <div className="text-white ml-2 font-ramaraja text-4xl font-bold">
          JOKER
        </div>
        <div className="w-40 h-60 border-dashed ml-5 border-2 border-yellow-600 bg-[#450A0366] rounded-lg flex justify-center items-center">
          {jokerValue ? (
            <img
              src={`./cards/${jokerValue}.png`} // Dynamically update the joker image
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

      <div className="flex relative h-1/2 justify-between p-4 border-b-4 border-yellow-600">
        <div className="text-white font-ramaraja text-6xl mt-10 font-bold mr-4">
          A
        </div>
        <div className="border-dashed border-2 border-yellow-600 rounded-lg w-full h-60 bg-[#450A0366] flex pl-32 items-center justify-left">
          {section0Cards.length > 0 &&
            section0Cards.map((card, index) => (
              <CardFlip
                key={index}
                index={index}
                frontImage={`./cards/${card}.png`}
                list={section0Cards}
                isRevealed={revealedCards[card] || false}
                frontContent={`Card ${card}`}
              />
            ))}
        </div>
      </div>

      <div className="flex h-1/2 justify-center p-4">
        <div className="text-white font-ramaraja text-6xl mt-10 font-bold mr-4">
          B
        </div>
        <div className="border-dashed border-2 border-yellow-600 rounded-lg w-full h-60 bg-[#450A0366] flex pl-32 items-center justify-left">
          {section1Cards.length > 0 &&
            section1Cards.map((card, index) => (
              <CardFlip
                key={index}
                index={index}
                frontImage={`./cards/${card}.png`}
                list={section1Cards}
                isRevealed={revealedCards[card] || false}
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
        <p className="text-3xl font-bold font-ramaraja ">Bets</p>
        <div className="flex-col items-start justify-start">
          <p className="text-lg">Max:{maxBet}</p>
          <p className="text-lg">Min: {minBet}</p>
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
      <div className="flex relative justify-center h-16 items-center space-x-2">
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
