import React, { useState } from 'react';
import Loader from 'react-loader-spinner';

const FullPageLoader = () => ( // Elemento JSX usado como spinner de tela cheia.
  <div className="Spinner">
    <Loader type="Oval" color="#fff" height={100} width={100} />
  </div>
);

const useFullPageLoader = () => { // Função hook que despacha estado do spinner e funções que mudam estado do spinner.
  const [loading, setLoading] = useState(false);
  return [
    loading ? <FullPageLoader /> : null, // Operador ternário - se true, mostra spinner, caso contrário não mostra nada
    () => setLoading(true), // Mostra spinner
    () => setLoading(false) // Esconde spinner
  ];
};

export default useFullPageLoader;