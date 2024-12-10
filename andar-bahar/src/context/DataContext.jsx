import React, { createContext, useState, useEffect, useContext } from 'react';
import apiEventEmitter from '../events/apiEventEmitter';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.100:8000/myapp/api/reset_collections/');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const handleApiCall = (eventData) => {
      if (eventData.success) {
        fetchData(); // Refetch data on successful API call
      } else {
        console.error('API call failed:', eventData.error || `Status: ${eventData.status}`);
      }
    };

    apiEventEmitter.on('apiCalled', handleApiCall);

    return () => {
      apiEventEmitter.off('apiCalled', handleApiCall);
    };
  }, []);

  return (
    <DataContext.Provider value={{ data, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
