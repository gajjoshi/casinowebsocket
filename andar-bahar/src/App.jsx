import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GridPage from "./GridPage";
import AndarBaharPage from "./AndarBaharPage";
import Page3 from "./Page3";
import Page4 from "./Page4";
import Page5 from "./Page5";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GridPage />} /> {/* Display */}
        <Route path="/dealer" element={<AndarBaharPage />} />
        {/* Andar Bahar game page */}
        <Route path="/player1" element={<Page3 />} />
        <Route path="/player2" element={<Page4 />} />
        <Route path="/player3" element={<Page5 />} />


      </Routes>
    </Router>
  );
};

export default App;
