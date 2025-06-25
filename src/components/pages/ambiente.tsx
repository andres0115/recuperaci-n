import React from 'react'
import Ambiente from '../templates/Ambientes/Ambiente';

const AmbientePage: React.FC = () => {
  
  const userName = "Wilson"; 
  
  return (
    <Ambiente userName={userName} />
  );
};

export default AmbientePage;
