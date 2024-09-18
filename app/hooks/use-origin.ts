import { useState, useEffect } from 'react';

const useOrigin = () => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) {
    return '';
  }

  return typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : '';
};

export default useOrigin;
