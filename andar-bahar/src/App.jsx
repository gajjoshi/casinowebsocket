import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GridPage from "./GridPage";
import AndarBaharPage from "./AndarBaharPage";
import Page3 from "./Page1";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GridPage />} /> {/* Display */}
        <Route path="/dealer" element={<AndarBaharPage />} />
        {/* Andar Bahar game page */}
        <Route path="/player" element={<Page3 />} />
      </Routes>
    </Router>
  );
};

export default App;
