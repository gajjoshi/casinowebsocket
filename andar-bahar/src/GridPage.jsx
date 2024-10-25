import React from "react";
import wood from "./assets/wood.png";
import ocean7 from "./assets/ocean7.png";
import logo from "./assets/logo.png";
import stat from "./assets/stat.png";
import a from "./assets/a.png";
import b from "./assets/b.png";
import screw from "./assets/screw.png";
import sidelogo from "./assets/sidelogo.png";

const GridPage = () => {
  return (
    <>
      <div className="bg-yellow-400 px-2 pt-1 text-center">
        <div className="bg-yellow-200 px-4 pt-2 text-center shadow-lg rounded-lg">
          <Header />
          <GameGrid />
        </div>
      </div>
      <div className="flex justify-between bg-[url('./assets/wood.png')]  shadow-lg border-2 border-yellow-600">
        <BettingSection />
        <Statistics />
        <AndarBaharButtons />
      </div>
      <Footer />
    </>
  );
};

const Header = () => {
  return (
    <div className="flex justify-between items-center py-5 px-10  bg-[url('./assets/wood.png')] relative font-questrial">
      <img src={ocean7} alt="ocean7" className="w-24 h-24" />
      <img
        src={logo}
        alt="logo"
        className="absolute left-1/2 mt-5 transform -translate-x-1/2 h-40"
      />
      <div className="text-3xl  text-yellow-300">
        Table <br></br> 1234
      </div>
    </div>
  );
};

const GameGrid = () => {
  return (
    <div className="bg-[#971909] relative">
      <img
        src={sidelogo}
        alt="sidelogo"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[80%] ml-[-30px]"
      />
      <img
        src={sidelogo}
        alt="sidelogo"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-[80%]"
      />
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-10 p-10 rounded-b-lg">
          {[...Array(50)].map((_, index) => (
            <div key={index} className="flex justify-center items-center py-2">
              <div className="w-16 h-16 bg-[#741003] rounded-full border-2 border-red-900 shadow-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BettingSection = () => {
  return (
    <div className="font-questrial p-4 rounded-lg  shadow-lg text-left w-1/4 relative">
      <img src={screw} alt="screw" className="absolute top-2 left-2 w-8 h-8" />
      <img src={screw} alt="screw" className="absolute top-2 right-2 w-8 h-8" />
      <div className="text-[#f3be39] text-center font-semibold">
        <p className="text-3xl font-bold font-ramaraja ">Bets</p>
        <div className="flex-col items-start justify-start">
          <p className="text-lg">Max: 20,000</p>
          <p className="text-lg">Min: 1,000</p>
        </div>
      </div>
    </div>
  );
};

const Statistics = () => {
  return (
    <div className="  text-[#f3be39] p-4 border-2 border-gray-400 shadow-lg w-2/4">
      <div className="text-center font-ramaraja text-4xl font-bold ">
        STATISTICS
      </div>
      <div className="flex justify-center h-16 items-center space-x-2">
        <img
          src={stat}
          alt="stat"
          className="w-[50%]  mt-[-10px]"
          // className="absolute left-1/2  transform -translate-x-1/2  h-24 mx-auto"
        />
      </div>
      {/* <div className="flex justify-center items-center space-x-2">
        <div className="bg-red-700 text-white rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold shadow-md">
          A
        </div>
        <div className="flex items-center">
          <div className="bg-red-600 h-8 w-24 flex items-center rounded-l-full">
            <div className="bg-yellow-400 h-full w-1/2"></div>
          </div>
          <div className="bg-blue-600 h-8 w-24 flex items-center rounded-r-full">
            <div className="bg-blue-400 h-full w-1/2"></div>
          </div>
        </div>
        <div className="bg-blue-700 text-white rounded-full w-12 h-12 flex justify-center items-center text-2xl font-bold shadow-md">
          B
        </div>
      </div> */}
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
