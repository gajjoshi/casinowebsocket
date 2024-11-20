import React, { useEffect } from 'react';
import { useData } from '../src/context/DataContext';

const Test = () => {
  const { data } = useData();

  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
    </div>
  );
};

export default Test;
