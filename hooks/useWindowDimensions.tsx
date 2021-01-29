import { useState, useEffect } from 'react';

function getWindowDimensions() {
  if (!process.browser) return;
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
    if (!process.browser) return;

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => {
      if (!process.browser) return;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowDimensions;
}
