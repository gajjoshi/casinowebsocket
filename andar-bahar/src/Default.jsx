
// components/PageVisibility.js
import React from "react";
import { usePlayerContext } from "./context/PlayerContext";

const Default = ({ pageName, children }) => {
  const { currentPlayers } = usePlayerContext();
  
  const isActive = currentPlayers.includes(pageName);

  return (
    isActive ? (
      <>{children}</> // Display content if active
    ) : (
        <div className="text-white bg-black w-screen h-screen flex item-center justify-center">This page is not in use currently.</div> // Default message if inactive
    )
  );
};

export default Default;
