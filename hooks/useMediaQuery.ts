import { useState, useEffect } from "react";

export const useMediaQuery = (width = 1024) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= width;
    }
    return true; // Default to desktop view during SSR
  });

  useEffect(() => {
    const query = `(min-width: ${width}px)`;
    const mediaQuery = window.matchMedia(query);

    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    // Initial check
    handleChange();

    // Add listeners
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [width]);

  return matches;
};
