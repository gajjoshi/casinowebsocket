import React, { useEffect, useState } from "react";
import axios from "axios";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
// import JokerAndCards from './JokerAndCards'
// import BetsAndStatistics from "./BetsAndStatistics"
import Page1 from "./Page1";
import Default from "./Default";
const Page3 = () => {
  const { width, height } = useWindowSize();

  return (
    <Default pageName="page3">
    <div className="min-h-screen bg-brown-700 ">
      <PlayerHeader  />
      {/* <JokerAndCards />
      <BetsAndStatistics 
        maxBet={20000} 
        minBet={1000} 
        aStat={50} // Example stats; replace with actual values
        bStat={50} // Example stats; replace with actual values
      /> */}
      <Page1/>
    </div>
    </Default>
  );
};
const PlayerHeader = () => {
  return (
    <div className="flex bg-[url('./assets/wood.png')] justify-center items-center py-4">
      <div className="bg-[#911606] text-white text-2xl font-bold px-8 py-2 rounded-full border-4 font-ramaraja border-yellow-600">
        Player 3
      </div>
    </div>
  );
};

// const JokerAndCards = () => {
//   const [jokerValue, setJokerValue] = useState(null);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [latestCard, setLatestCard] = useState(null);
//   const [section0Cards, setSection0Cards] = useState([]);
//   const [section1Cards, setSection1Cards] = useState([]);

//   const { width, height } = useWindowSize();

//   const fetchJokerValue = () => {
//     axios
//       .get("http://127.0.0.1:8000/myapp/api/get_joker_value/")
//       .then((response) => {
//         const { value } = response.data.data;
//         if (value) {
//           setJokerValue(value);
//         } else {
//           setTimeout(fetchJokerValue, 500);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching joker value:", error);
//         setTimeout(fetchJokerValue, 500);
//       });
//   };

//   const fetchCardData = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/myapp/api/assign_card_to_section_A/');
//       if (response.data.success) {
//         const newCard = response.data.value;
//         const sectionId = response.data.section_id;
//         const result = response.data.result;

//         setLatestCard(newCard);
        
//         // Update card history
//         if (sectionId === 0) {
//           setSection0Cards((prev) => [...prev, newCard]);
//         } else if (sectionId === 1) {
//           setSection1Cards((prev) => [...prev, newCard]);
//         }

//         // Trigger confetti if there's a win
//         if (result === '0 wins' || result === '1 wins') {
//           setShowConfetti(true);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching card data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchJokerValue();
//     const intervalId = setInterval(fetchCardData, 500);
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div className="bg-red-700 rounded-lg p-4 border-8 border-yellow-600">
//       {/* Joker Section */}
//       <div className="flex justify ml-5 items-center border-b-2 border-yellow-600 pb-4 mb-4">
//         <div className="text-white text-4xl font-bold">JOKER</div>
//         <div className="w-40 h-60 border-dashed ml-5 border-4 border-yellow-600 bg-red-800 rounded-lg flex justify-center items-center">
//           {jokerValue ? (
//             <img
//               src={`./cards/${jokerValue}.png`}
//               alt="Joker Card"
//               className="w-20"
//             />
//           ) : (
//             <p className="text-white">Loading...</p>
//           )}
//         </div>
//       </div>

//       {/* Section A */}
//       <CardSection title="A" cards={section0Cards} />

//       {/* Section B */}
//       <CardSection title="B" cards={section1Cards} />
      
//       {showConfetti && <Confetti width={width} height={height} />}
//     </div>
//   );
// };

// const CardSection = ({ title, cards }) => {
//   return (
//     <div className="flex justify-start ml-5 items-center border-b-2 border-yellow-600 pb-4 mb-4">
//       <div className="text-white text-4xl font-bold">{title}</div>
//       <div className="flex w-full h-60 border-dashed ml-5 border-4 border-yellow-600 bg-red-800 rounded-lg items-center justify-left">
//         <div className="ml-8 flex items-center justify-left h-48">
//           {cards.length > 0 ? (
//             cards.map((card, index) => (
//               <img
//                 key={index}
//                 src={`./cards/${card}.png`}
//                 alt={`Card ${card}`}
//                 className="w-auto -ml-8 h-4/5"
//               />
//             ))
//           ) : (
//             <p>No cards</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const BetsAndStatistics = ({ maxBet, minBet, aStat, bStat }) => {
//   return (
//     <div className="mt-8 bg-brown-900 p-4 rounded-lg border-2 border-yellow-600">
//       <div className="flex justify-between">
//         {/* Bets Section */}
//         <div className="text-yellow-300 text-left font-semibold">
//           <p className="text-xl font-bold">Bets</p>
//           <p>Max: {maxBet}</p>
//           <p>Min: {minBet}</p>
//         </div>

//         {/* Statistics Section */}
//         <div className="text-center text-yellow-300 font-bold">
//           <div className="text-2xl mb-2">STATISTICS</div>
//           <div className="flex items-center space-x-2">
//             <div className="bg-red-700 text-white rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold shadow-md">
//               A
//             </div>
//             <div className="flex items-center">
//               <div className="bg-red-600 h-8 w-24 flex items-center rounded-l-full">
//                 <div className="bg-yellow-400 h-full w-1/2"></div>
//               </div>
//               <div className="bg-blue-600 h-8 w-24 flex items-center rounded-r-full">
//                 <div className="bg-blue-400 h-full w-1/2"></div>
//               </div>
//             </div>
//             <div className="bg-blue-700 text-white rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold shadow-md">
//               B
//             </div>
//           </div>
//         </div>

//         {/* Andar / Bahar Buttons */}
//         <div className="flex space-x-4 items-center">
//           <div className="flex flex-col items-center">
//             <div className="bg-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
//               A
//             </div>
//             <div className="text-yellow-300 font-semibold">Andar</div>
//           </div>
//           <div className="flex flex-col items-center">
//             <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
//               B
//             </div>
//             <div className="text-yellow-300 font-semibold">Bahar</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default Page3;
