import { useState, useEffect } from 'react';

function getWindowDimensions() {
  if (typeof window !== 'object')
    return {
      width: 0,
      height: 0,
    };
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (typeof window !== 'object') return;

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => {
      if (typeof window !== 'object') return;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowDimensions;
}
