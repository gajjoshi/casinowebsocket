// FlipContext.js
import React, { createContext, useState, useContext } from "react";

const FlipContext = createContext();

export const FlipProvider = ({ children }) => {
  const [isRevealed, setIsRevealed] = useState(true);

  // Toggle the revealed state
  const toggleReveal = () => setIsRevealed((prev) => !prev);

  return (
    <FlipContext.Provider value={{ isRevealed, toggleReveal }}>
      {children}
    </FlipContext.Provider>
  );
};

// Custom hook to use flip context
export const useFlip = () => useContext(FlipContext);
