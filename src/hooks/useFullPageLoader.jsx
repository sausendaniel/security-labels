import React, { useState } from 'react';
import Loader from 'react-loader-spinner';

const FullPageLoader = () => (
  <div className="Spinner">
    <Loader type="Oval" color="#fff" height={100} width={100} />
  </div>
);

const useFullPageLoader = () => {
  const [loading, setLoading] = useState(false);
  return [
    loading ? <FullPageLoader /> : null,
    () => setLoading(true), //Show loader
    () => setLoading(false) //Hide Loader
  ];
};

export default useFullPageLoader;