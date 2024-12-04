import React, { useContext, useRef } from "react";
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
// import { RefreshContext } from "./context/RefreshContext";
import { useNavigate } from "react-router-dom";

const AndarBaharPage = () => {
  const { toggleReveal } = useFlip();
  const [sectionId, setSectionId] = useState(0);
  const [section0Cards, setSection0Cards] = useState([]);
  const [section1Cards, setSection1Cards] = useState([]);
  const [cardValue, setCardValue] = useState("");
  const handleWin = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [won, setWon] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [prevId, setPrevId] = useState(0);

 

  return (
    <div className="min-h-screen bg-[#450A03] ">
      <WinnerModal show={showModal} onClose={handleCloseModal} winner={won} />

      <TopMenu
        sectionId={sectionId}
        cardValue={cardValue}
        setCardValue={setCardValue}
      />
      <div className="flex flex-col lg:flex-row justify-between p-2">
        <AndarBaharSection
          setSectionId={setSectionId}
          section0Cards={section0Cards}
          setSection0Cards={setSection0Cards}
          section1Cards={section1Cards}
          setSection1Cards={setSection1Cards}
        />

        <ScoreAndJokerSection
          sectionId={sectionId}
          section0Cards={section0Cards}
          section1Cards={section1Cards}
          setSection0Cards={setSection0Cards}
          setSection1Cards={setSection1Cards} 
        />
      </div>
    </div>
  );
};
const allPlayers = ["page1", "page2", "page3", "page4", "page5", "page6"];
const TopMenu = ({ sectionId}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showBet, setShowBet] = useState(false);
  const [cardValue, setCardValue] = useState(""); // To store the card value from input
  const [cardNumber, setCardNumber] = useState(""); // To store the selected card number
  const [cardGroup, setCardGroup] = useState(""); // To store the selected card group
  const [showCardPopup, setShowCardPopup] = useState(false); // To toggle the popup
  const [showAddCardPopup, setShowAddCardPopup] = useState(false); // To toggle the popup
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [isPushing, setIsPushing] = useState(false); // To track if pushing is active

  const cardNumbers = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
  ];
  const cardGroups = ["H", "S", "D", "C"];

  const addCard = async (cardValue) => {
    const requestBody = {
      value: cardValue,
      id: sectionId,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/myapp/api/add-card/",
        {
          method: "POST", // Use POST to send data
          headers: {
            "Content-Type": "application/json", // Ensure the server knows you're sending JSON
          },
          body: JSON.stringify(requestBody), // Convert the request body to JSON
        }
      );

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add card");
      }

      const data = await response.json();
      console.log("Card added successfully:", data);
      return data;
    } catch (error) {
      console.error("Error adding card:", error.message);
      alert(error.message); // Show user-friendly error message
      return null;
    }
  };

  const handleCardAdd = () => {
    if (cardNumber && cardGroup) {
      const cardValue = `${cardNumber}${cardGroup}`;
      console.log("cardValue", cardValue);
      addCard(cardValue);
      setShowAddCardPopup(false); // Close the popup after updating the card
    } else {
      alert("Please select both card number and group.");
    }
  };

  const handleCardUpdate = () => {
    if (cardNumber && cardGroup) {
      const cardValue = `${cardNumber}${cardGroup}`;
      console.log("cardValue", cardValue);

      const requestBody = { value: cardValue }; // Wrap the card value in an object

      fetchCardData("PUT", requestBody); // Pass the formatted request body to the function
      setShowCardPopup(false); // Close the popup after updating the card
    } else {
      alert("Please select both card number and group.");
    }
  };

  const current_players = [
    "page1",
    "page2",
    "page3",
    "page4",
    "page5",
    "page6",
  ];
  const updateCard = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/myapp/api/update_last_card/"
      );
      if (response.data) {
        const updatedCard = response.data.value; // New card value
        const sectionId = response.data.section_id; // Section ID of the card to be updated

        // Update the last card in the respective section
        if (sectionId === 1) {
          setSection1Cards((prev) => {
            const updatedCards = [...prev];
            updatedCards[updatedCards.length - 1] = updatedCard; // Replace the last card
            return updatedCards;
          });
          revealCard(updatedCard, "section1"); // Optional: Trigger reveal animation
        } else if (sectionId === 0) {
          setSection0Cards((prev) => {
            const updatedCards = [...prev];
            updatedCards[updatedCards.length - 1] = updatedCard; // Replace the last card
            return updatedCards;
          });
          revealCard(updatedCard, "section0"); // Optional: Trigger reveal animation
        }

        console.log("Card updated successfully:", updatedCard);
      }
    } catch (error) {
      console.error("Error updating the card:", error);
    }
  };
  // const [isPushing, setIsPushing] = useState(false); // To track the pushing status

  // const startPush = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://127.0.0.1:8000/myapp/api/start-push/",
  //       {
  //         method: "POST",
  //       }
  //     );
  //     const data = await response.json();
  //     if (data.message === "Pushing started.") {
  //       setIsPushing(true); }
  //   } catch (error) {
  //     console.error("Error starting the push:", error);
  //   }
  // };

  const stopPush = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/myapp/api/stop_push/",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (data.message === "Pushing stopped.") {
        setIsPushing(false);
      }
    } catch (error) {
      console.error("Error stopping the push:", error);
    }
  };

  const startPush = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/myapp/api/start_push/",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (data.message === "Pushing started.") {
        setIsPushing(true);
        console.log(data);
        setShowStartDropdown(true); // Show additional buttons
      }
    } catch (error) {
      console.error("Error starting the push:", error);
    }
  };

  const pushCards = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/myapp/api/push_to_mongo/",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (data.message === "Cards pushed successfully.") {
        console.log("Cards are being pushed");
      }
    } catch (error) {
      console.error("Error pushing cards:", error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/myapp/api/reset_collections/"
      );

      if (response.status === 200) {
        console.log("Reset successful:", response.data);
        // alert("Collections have been reset!");
      } else {
        console.log("Reset failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error resetting collections:", error);
    }
    window.location.reload();
  };

  const [currentPlayers, setCurrentPlayers] = useState([]);

  

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
                className="block w-full text-left px-4 py-2 hover:bg-red-700"
                onClick={() => setShowStartDropdown(true)}
                disabled={isPushing}
              >
                Start Automatic Game
              </button>
              {showStartDropdown && (
                <div className="absolute top-0 right-0 bg-black bg-opacity-50 flex  justify-center items-center z-50">
                  <div className="bg-[#971909] border-2 border-yellow-600 rounded-lg p-6 w-60 shadow-lg">
                    <h2 className="text-yellow-300 text-lg mb-4 text-center">
                      Automatic Game Options
                    </h2>
                    <div className="flex flex-col gap-4">
                      <button
                        className="w-full bg-red-700 text-yellow-300 px-4 py-2 rounded-md hover:bg-red-800"
                        onClick={startPush}
                      >
                        Start Push
                      </button>
                      <button
                        className="w-full bg-red-700 text-yellow-300 px-4 py-2 rounded-md hover:bg-red-800"
                        onClick={pushCards}
                      >
                        Push Cards
                      </button>
                      <button
                        className="w-full bg-red-700 text-yellow-300 px-4 py-2 rounded-md hover:bg-red-800"
                        onClick={stopPush}
                      >
                        Stop Push
                      </button>
                      <button
                        className="w-full bg-gray-600 text-yellow-300 px-4 py-2 rounded-md hover:bg-gray-700"
                        onClick={() => setShowStartDropdown(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowCardPopup(true)}
                className="block w-full text-left px-4 py-2 hover:bg-red-700"
              >
                Update Card
              </button>{" "}
              {showCardPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-[#971909] border-2 border-yellow-600 rounded-lg p-6 w-80 shadow-lg">
                    <h2 className="text-yellow-300 text-lg mb-4 text-center">
                      Select Card
                    </h2>

                    <div className="mb-4">
                      <label
                        htmlFor="card-number"
                        className="block text-yellow-300 mb-2"
                      >
                        Select Card Number
                      </label>
                      <select
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="p-2 w-full border bg-[#971909] text-yellow-300 border-yellow-600 rounded-md"
                      >
                        <option
                          value=""
                          className="bg-[#971909] text-yellow-300"
                        >
                          -- Select Number --
                        </option>
                        {cardNumbers.map((number) => (
                          <option
                            key={number}
                            value={number}
                            className="bg-[#971909] text-yellow-300 hover:bg-yellow-700 hover:text-white"
                          >
                            {number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="card-group"
                        className="block text-yellow-300 mb-2"
                      >
                        Select Card Group
                      </label>
                      <select
                        id="card-group"
                        value={cardGroup}
                        onChange={(e) => setCardGroup(e.target.value)}
                        className="p-2 w-full border bg-[#971909] text-yellow-300 border-yellow-600 rounded-md"
                      >
                        <option
                          value=""
                          className="bg-[#971909] text-yellow-300"
                        >
                          -- Select Group --
                        </option>
                        {cardGroups.map((group) => (
                          <option
                            key={group}
                            value={group}
                            className="bg-[#971909] text-yellow-300 hover:bg-yellow-700 hover:text-white"
                          >
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => setShowCardPopup(false)}
                        className="bg-gray-600 text-yellow-300 px-4 py-2 rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCardUpdate}
                        className="bg-red-700 text-yellow-300 px-4 py-2 rounded-md hover:bg-red-800"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowAddCardPopup(true)}
                className="block w-full text-left px-4 py-2 hover:bg-red-700"
              >
                Add Card
              </button>{" "}
              {showAddCardPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-[#971909] border-2 border-yellow-600 rounded-lg p-6 w-80 shadow-lg">
                    <h2 className="text-yellow-300 text-lg mb-4 text-center">
                      Select Card
                    </h2>

                    <div className="mb-4">
                      <label
                        htmlFor="card-number"
                        className="block text-yellow-300 mb-2"
                      >
                        Select Card Number
                      </label>
                      <select
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="p-2 w-full border bg-[#971909] text-yellow-300 border-yellow-600 rounded-md"
                      >
                        <option
                          value=""
                          className="bg-[#971909] text-yellow-300"
                        >
                          -- Select Number --
                        </option>
                        {cardNumbers.map((number) => (
                          <option
                            key={number}
                            value={number}
                            className="bg-[#971909] text-yellow-300 hover:bg-yellow-700 hover:text-white"
                          >
                            {number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="card-group"
                        className="block text-yellow-300 mb-2"
                      >
                        Select Card Group
                      </label>
                      <select
                        id="card-group"
                        value={cardGroup}
                        onChange={(e) => setCardGroup(e.target.value)}
                        className="p-2 w-full border bg-[#971909] text-yellow-300 border-yellow-600 rounded-md"
                      >
                        <option
                          value=""
                          className="bg-[#971909] text-yellow-300"
                        >
                          -- Select Group --
                        </option>
                        {cardGroups.map((group) => (
                          <option
                            key={group}
                            value={group}
                            className="bg-[#971909] text-yellow-300 hover:bg-yellow-700 hover:text-white"
                          >
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => setShowAddCardPopup(false)}
                        className="bg-gray-600 text-yellow-300 px-4 py-2 rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCardAdd}
                        className="bg-red-700 text-yellow-300 px-4 py-2 rounded-md hover:bg-red-800"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
  setSection1Cards,
 
}) => {
  const [revealedCards, setRevealedCards] = useState({});
  const [won, setWon] = useState(-1);

  const [showModal, setShowModal] = useState(false);

  const handleWin = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

const ScoreAndJokerSection = ({
  sectionId,
  section0Cards,
  section1Cards,
  setSection0Cards,
  setSection1Cards,
}) => {
  const [jokerValue, setJokerValue] = useState(null);
  const isJokerSet = useRef(false);
  const [socket, setSocket] = useState(null);
  const [showResetPopup, setShowResetPopup] = useState(false); // State for showing reset popup
  const [won, setWon] = useState(-1);
  const [showModal, setShowModal] = useState(false);

  const handleWin = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:6789");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Data received from server:", data);

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
          setWon(section_id);
          handleWin();
          win_section();

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

  const win_section = () => {
    console.log("insdie win section");
    if (socket) {
      const winMessage = {
        action: "win_section",
        // section_id: section_id,
      };
      socket.send(JSON.stringify(winMessage));
      console.log("win section sent.");
    } else {
      console.log("WebSocket connection is not open.");
    }
  };

  const handleResetClick = () => {
    setShowResetPopup(true); // Show the confirmation popup
  };

  const confirmReset = () => {
    resetCollections(); // Perform the reset
    setShowResetPopup(false);
    window.location.reload(); // Close the popup
  };

  const cancelReset = () => {
    setShowResetPopup(false); // Close the popup without resetting
  };

  return (
    <div className="flex flex-col justify-start w-full lg:w-1/4">
      <WinnerModal show={showModal} onClose={handleCloseModal} winner={won} />
      {/* Score Section */}
      <div className="p-2">
        <div
          className={`flex justify-between items-center p-5 ${
            sectionId === 1 ? "bg-[#07740C]" : "bg-[#FFF8D6]"
          } text-black text-2xl font-bold mb-2`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-12 h-16 overflow-clip">
              <img src={a} alt="a" className="w-16" />
            </div>
            <span className="text-black text-5xl">{section0Cards.length}</span>
          </div>
        </div>
        <div
          className={`flex justify-between items-center p-5 ${
            sectionId === 0 ? "bg-[#07740C]" : "bg-[#FFF8D6]"
          } text-black text-2xl font-bold`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-12 h-16 pt-1 overflow-clip">
              <img src={b} alt="b" className="w-16" />
            </div>
            <span className="text-black text-5xl">{section1Cards.length}</span>
          </div>
        </div>
      </div>

      {/* Joker Section */}
      <div className="h-full bg-[#971909] p-4 shadow-lg border-2 border-[#D6AB5D]">
        <div className="text-white font-ramaraja text-5xl mt-5 font-bold text-center">
          JOKER
        </div>
        <div className="flex justify-center items-center">
          <div className="border-dashed border-2 flex justify-center items-center border-yellow-600 rounded-lg w-40 h-60 bg-[#450A0366] mt-4">
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
        <button
          onClick={handleResetClick}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset Collections
        </button>
      </div>

      {/* Reset Confirmation Popup */}
      {showResetPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <p className="mb-4">Are you sure you want to reset the collections?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmReset}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={cancelReset}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AndarBaharPage;
