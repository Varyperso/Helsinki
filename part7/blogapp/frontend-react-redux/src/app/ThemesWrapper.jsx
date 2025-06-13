import { useState } from "react";
import { ThemeProvider } from "styled-components";

const baseLayout = {
  layout: {
    basePadding: 'clamp(1rem, 2vw, 3rem)',
  },
};

export const lightTheme = {
  colors: {
    background: '#ffffff',
    text: '#222222',
    primary: '#3a00df',    // bright blue/purple
    secondary: '#ccc',     // light gray
    accent: '#359eff',
  },
  ...baseLayout,
};

export const darkTheme = {
  colors: {
    background: '#121212',
    text: '#eeeeee',
    primary: '#8a73ff',    // softer purple
    secondary: '#444444',  // dark gray
    accent: '#5a9eff',
  },
  ...baseLayout,
};

export default function ThemesWrapper({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <button style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }} onClick={() => setDarkMode(!darkMode)}>
        Toggle Mode
      </button>
      {children}
    </ThemeProvider>
  );
}