import { useEffect, useState } from "react";

const THEME_KEY = "theme";

export const useTheme = () => {
  const [theme, setTheme] = useState("light");

  // 🔹 Initialize theme
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);

    if (storedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(storedTheme);
      document.documentElement.classList.toggle(
        "dark",
        storedTheme === "dark"
      );
    } else {
      // system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const defaultTheme = prefersDark ? "dark" : "light";

      setTheme(defaultTheme);
      document.documentElement.classList.toggle(
        "dark",
        defaultTheme === "dark"
      );
    }
  }, []);

  // 🔹 Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    document.documentElement.classList.toggle(
      "dark",
      newTheme === "dark"
    );
  };

  return { theme, toggleTheme };
};