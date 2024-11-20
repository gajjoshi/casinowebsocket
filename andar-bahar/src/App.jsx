import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GridPage from "./GridPage";

import AndarBaharPage from "./AndarBaharPage";
import Page3 from "./Page3";
import Page4 from "./Page4";
import Page5 from "./Page5";
import Page2 from "./Page2";
import Page01 from "./Page01";
import Page6 from "./Page6";
import Test from "./Test";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GridPage />} /> {/* Display */}
        <Route path="/dealer" element={<AndarBaharPage />} />
        {/* Andar Bahar game page */}
        <Route path="/player1" element={<Page01 />} />
        <Route path="/player2" element={<Page2 />} />
        <Route path="/player3" element={<Page3 />} />
        <Route path="/player4" element={<Page4 />} />
        <Route path="/player5" element={<Page5 />} />
        <Route path="/player6" element={<Page6 />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
