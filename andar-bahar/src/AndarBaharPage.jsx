import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import screw from "./assets/screw.png";
import logo from "./assets/logo.png";
import menu from "./assets/menu.png";
import redhat from "./assets/redhat.png";
import whitehat from "./assets/whitehat.png";
import sidelogo from "./assets/sidelogo.png";
import a from "./assets/a.png";
import b from "./assets/b.png";
import ocean7 from "./assets/ocean7.png";
import Confetti from "react-confetti";
import CardFlip from "./components/CardFlip";
import BetPopUp from "./BetPopUp";
import PlayerSelectionPopup from "./PlayerSelectionpopUp";
import WinnerModal from "./components/WinnerModal";
import { useFlip } from "./context/FlipContext";
import { RefreshContext } from "./context/RefreshContext";
import { useNavigate } from "react-router-dom";

const AndarBaharPage = () => {
  const { toggleReveal } = useFlip();
  const [sectionId, setSectionId] = useState(0);
  const [section0Cards, setSection0Cards] = useState([]);
  const [section1Cards, setSection1Cards] = useState([]);

  return (
    <div className="min-h-screen bg-[#450A03] ">
      <TopMenu />
      <div className="flex flex-col lg:flex-row justify-between p-2">
        <AndarBaharSection setSectionId={setSectionId}
          section0Cards={section0Cards}
          setSection0Cards={setSection0Cards}
          section1Cards={section1Cards}
          setSection1Cards={setSection1Cards} />

        <ScoreAndJokerSection  sectionId={sectionId}
          section0Cards={section0Cards}
          section1Cards={section1Cards}/>
      </div>
    </div>
  );
};
const allPlayers = ["page1", "page2", "page3", "page4", "page5", "page6"];
const TopMenu = () => {

  const navigate = useNavigate();

  const { refreshPage1 } = useContext(RefreshContext);

  const [refreshKey, setRefreshKey] = React.useState(0);

  // Call this function to trigger a re-render of ChildComponent
  const refreshChild = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showBet, setShowBet] = useState(false);

  const current_players = [
    "page1",
    "page2",
    "page3",
    "page4",
    "page5",
    "page6",
  ];
  const [isPushing, setIsPushing] = useState(false); // To track the pushing status

  const startPush = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/myapp/api/start-push/', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.message === 'Pushing started.') {
        setIsPushing(true);  // Update the state to indicate pushing has started
      }
    } catch (error) {
      console.error('Error starting the push:', error);
    }
  };

  const stopPush = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/myapp/api/stop-push/', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.message === 'Pushing stopped.') {
        setIsPushing(false);  // Update the state to indicate pushing has stopped
      }
    } catch (error) {
      console.error('Error stopping the push:', error);
    }
  };
  const handleReset = async () => {
    setRefreshKey((oldKey) => oldKey + 1);


    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/myapp/api/reset_collections/"
      );
      if (response.status === 200) {
        console.log("Reset successful:", response.data);
        alert("Collections have been reset!");
      } else {
        console.log("Reset failed with status:", response.status);
      }
      // refreshPage1();
      


    } catch (error) {
      console.error("Error resetting collections:", error);
    }
    window.location.reload();


  };


  const [currentPlayers, setCurrentPlayers] = useState([]);

  useEffect(() => {
    // Fetch current players from the API
    const fetchCurrentPlayers = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/myapp/api/player-round/"
        );
        const data = await response.json();
        // console.log(data.currentPlayers);
        // Check if current players list is provided, else leave empty
        setCurrentPlayers(data.current_players);
        console.log(`current player:${currentPlayers}`);
      } catch (error) {
        console.error("Error fetching current players:", error);
      }
    };

    fetchCurrentPlayers();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between  bg-[url('./assets/wood.png')] shadow-lg border-2 border-yellow-600">
      {/* Left Section */}
      <div className="font-questrial p-4 rounded-lg shadow-lg text-left md:w-1/4 w-full relative">
        <img
          src={screw}
          alt="screw"
          className="absolute top-2 left-2 w-8 h-8"
        />
        <img
          src={screw}
          alt="screw"
          className="absolute top-2 right-2 w-8 h-8"
        />
        <div className="flex-col justify-center items-center">
          <div className="flex justify-center items-center">
            <img src={logo} alt="logo" className="h-14" />
          </div>
          <div className="text-xl text-center text-yellow-300">Table 1234</div>
        </div>
      </div>

      <div className="flex py-5 border px-5 gap-3 overflow-x-auto">
        {allPlayers.map((player, index) => (
          <img
            key={index}
            src={currentPlayers?.includes(player) ? whitehat : redhat}
            alt={currentPlayers?.includes(player) ? "white hat" : "red hat"}
            className="h-16"
          />
        ))}
      </div>

      {/* Right Section with Menu and Dropdown */}
      <div className="font-questrial p-4 rounded-lg shadow-lg text-left md:w-1/4 w-full relative">
        <img
          src={screw}
          alt="screw"
          className="absolute top-2 left-2 w-8 h-8"
        />
        <img
          src={screw}
          alt="screw"
          className="absolute top-2 right-2 w-8 h-8"
        />
        <div className="flex-col justify-center items-center relative">
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src={menu} alt="menu" className="h-20" />
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#971909] text-yellow-300 border-2 border-[#D6AB5D] shadow-lg p-2 gap-2">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-red-700"
                onClick={() => {
                  handleReset();
                  setShowDropdown(false);
                }}
              >
                Reset
              </button>

              <button
                className="block w-full text-left px-4 py-2 hover:bg-red-700"
                onClick={() => {
                  // handleSetBidValue();
                  setShowDropdown(false);
                }}
              >
                Set Bid Value
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-red-700"
                onClick={() => setShowPopup(true)}
              >
                Select Player
              </button>

              {/* Render Popup Conditionally */}
              {showPopup && (
                <PlayerSelectionPopup setShowPopup={setShowPopup} />
              )}
              <button
                onClick={() => setShowBet(true)}
                className="block w-full text-left px-4 py-2 hover:bg-red-700"
              >
                Change Bets
              </button>

              {showBet && <BetPopUp setShowBet={setShowBet} />}
              <button
        onClick={startPush}
        disabled={isPushing}  // Disable the start button when pushing is active
        className={`block w-full text-left px-4 py-2 hover:bg-red-700 ${isPushing ? 'opacity-50' : ''}`}
      >
        Start Automatic Game
      </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AndarBaharSection = ({
  setSectionId,
  section0Cards,
  setSection0Cards,
  section1Cards,
  setSection1Cards
}) => {
  // const [section0Cards, setSection0Cards] = useState([]);
  // const [section1Cards, setSection1Cards] = useState([]);
  const [revealedCards, setRevealedCards] = useState({});
  const [won, setWon] = useState(-1);
  // console.log("section0Cards:", section0Cards);

  const fetchCardData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/myapp/api/assign_card_to_section_A/"
      );
      if (response.data) {
        const newCard = response.data.value;
        const sectionId = response.data.section_id;

        setSectionId(sectionId);

        if (sectionId === 0) {
          setSection0Cards((prev) => [...prev, newCard]);
          revealCard(newCard, "section0");
        } else if (sectionId === 1) {
          setSection1Cards((prev) => [...prev, newCard]);
          revealCard(newCard, "section1");
        }
        const result = response.data.result;

        // Check the "result" field and give alerts accordingly
        if (result === "0 wins") {
          setWon(0);
          handleWin();
          stopPush();
          

        } else if (result === "1 wins") {
          // alert(" 1 wins");
          setWon(1);
          handleWin();

          // Trigger confetti on win
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
    const intervalId = setInterval(fetchCardData, 500);
    return () => clearInterval(intervalId);
  }, []);

  const [showModal, setShowModal] = useState(false);

  const handleWin = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const stopPush = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/myapp/api/stop-push/', {
        method: 'POST',
      });
      const data = await response.json();
      // if (data.message === 'Pushing stopped.') {
      //   setIsPushing(false);  // Update the state to indicate pushing has stopped
      // }
    } catch (error) {
      console.error('Error stopping the push:', error);
    }
  };
  return (
    <div className="flex flex-col w-full lg:w-3/4 bg-[#971909] p-4 shadow-lg border-2 border-[#D6AB5D]">
      <WinnerModal show={showModal} onClose={handleCloseModal} winner={won} />
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

const ScoreAndJokerSection = ({ sectionId, section0Cards, section1Cards }) => {
  const [jokerValue, setJokerValue] = useState(null);
  const { toggleReveal } = useFlip();

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
        // console.error("Error fetching joker value:", error);
        // Retry after a delay in case of error
        setTimeout(fetchJokerValue, 500); // Retry every 3 seconds
      });
  };

  // const [section0Cards, setSection0Cards] = useState([]); // State to store history of section 0 cards
  // const [section1Cards, setSection1Cards] = useState([]);
  // const fetchCardData = async () => {
  //   try {
  //     const response = await axios.get('http://127.0.0.1:8000/myapp/api/assign_card_to_player/');
  //     if (response.data.success) {
  //       console.log(response.data);
  //       const newCard = response.data.value;
  //       const sectionId = response.data.section_id;
  //       console.log("sectionid:"+sectionId)
  //       const result = response.data.result;

  //       // Update the latest card value
  //       setLatestCard(newCard);
  //       console.log('Updated card: ' + newCard);

  //       // Check section_id and update the corresponding card history
  //       if (sectionId === 0) {
  //         setSection0Cards((prevHistory) => [...prevHistory, newCard]);
  //       } else if (sectionId === 1) {
  //         setSection1Cards((prevHistory) => [...prevHistory, newCard]);
  //       }

  //       // Check the "result" field and give alerts accordingly
  //       if (result === '0 wins') {
  //         alert(" 0 wins");
  //         <Confetti
  //         width={width}
  //         height={height}
  //       />

  //       } else if (result === '1 wins') {
  //         alert(" 1 wins");
  //         <Confetti width={width} height={height}  />
  //   // Trigger confetti on win

  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching card data:', error);
  //   }
  // };
  // useEffect(() => {
  //   // Fetch the data every 5 seconds
  //   const intervalId = setInterval(fetchCardData, 1000);

  //   // Clean up the interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  // Fetch the joker value on component mount
  useEffect(() => {
    fetchJokerValue();
  }, []);
  return (
    <div className="flex flex-col justify-start w-full lg:w-1/4 ">
      {/* Score */}
      <div className="p-2">
        <div
          className={`flex justify-between items-center p-5 ${
            sectionId === 0 ? "bg-[#07740C]" : "bg-[#FFF8D6]"
          } text-black text-2xl font-bold mb-2`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-12 h-16 overflow-clip">
              <img src={a} alt="a" className="w-16 " />
            </div>
            <span className="text-black text-5xl">{section0Cards.length}</span>
          </div>
        </div>
        <div
          className={`flex justify-between items-center p-5 ${
            sectionId === 1 ? "bg-[#07740C]" : "bg-[#FFF8D6]"
          } text-black text-2xl font-bold`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-12 h-16 pt-1 overflow-clip">
              <img src={b} alt="b" className="w-16 " />
            </div>
            <span className="text-black text-5xl">{section1Cards.length}</span>
          </div>
        </div>
      </div>
      {/* Joker Section */}
      <div className="h-full bg-[#971909] p-4  shadow-lg border-2 border-[#D6AB5D]">
        <div className="text-white font-ramaraja text-5xl mt-5 font-bold text-center">
          JOKER
        </div>
        <div className="flex justify-center items-center">
          <div className="border-dashed border-2 flex justify-center items-center border-yellow-600 rounded-lg w-40 h-60 bg-[#450A0366] mt-4 ">
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
      </div>
      {/* <button
        onClick={() => toggleReveal()}
        className="m-2 p-2 bg-[#971909]  text-white rounded"
      >
        Flip Cards
      </button> */}
    </div>
  );
};

export default AndarBaharPage;
