import React, { useEffect, useState } from "react";
import axios from "axios";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
// import JokerAndCards from './JokerAndCards'
// import BetsAndStatistics from "./BetsAndStatistics"
import Page1 from "./Page1";
import Default from "./Default";



const Page6 = () => {
  const { width, height } = useWindowSize();

  return (
    <Default pageName="page6">

    <div className="min-h-screen bg-brown-700 ">
      <PlayerHeader  />
     <Page1/>
    </div>
    </Default>
  );
};

const PlayerHeader = () => {
  return (
    <div className="flex bg-[url('./assets/wood.png')] justify-center items-center py-4">
      <div className="bg-[#911606] text-white text-2xl font-bold px-8 py-2 rounded-full border-4 font-ramaraja border-yellow-600">
        Player 6
      </div>
    </div>
  );
};


export default Page6;