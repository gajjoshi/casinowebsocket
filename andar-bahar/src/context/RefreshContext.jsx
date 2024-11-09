import React, { createContext, useState } from "react";

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPage1 = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <RefreshContext.Provider value={{ refreshKey, refreshPage1 }}>
      {children}
    </RefreshContext.Provider>
  );
};
