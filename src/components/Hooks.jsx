import {useState, useEffect} from 'react';

export function useUpdateCSSVariable(variable, value) {
  useEffect(() => {
    document.documentElement.style.setProperty(variable, value);

    return () => {
      document.documentElement.style.removeProperty(variable);
    };
  }, [variable, value]);
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : undefined,
    height: typeof window !== 'undefined' ? window.innerHeight : undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    // Initial size is now set in useState, so we don't need to call handleResize here

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
