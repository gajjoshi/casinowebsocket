import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PlayerProvider } from "./context/PlayerContext.jsx";
import { FlipProvider } from "./context/FlipContext.jsx";
import { RefreshProvider } from "./context/RefreshContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PlayerProvider>
      <FlipProvider>
        <RefreshProvider>
        <App />
        </RefreshProvider>
        </FlipProvider>
    </PlayerProvider>
  </StrictMode>
);
