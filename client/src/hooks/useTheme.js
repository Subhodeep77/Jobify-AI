import { useEffect, useState } from "react";

const THEME_KEY = "theme";

export const useTheme = () => {
  const [theme, setTheme] = useState("light");

  // 🔹 Initialize theme (runs once)
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);

    if (storedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // 🔥 Sync theme → DOM + localStorage
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // 🔹 Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};