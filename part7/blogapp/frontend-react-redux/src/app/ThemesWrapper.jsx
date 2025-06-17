import { useState } from "react";
import { ThemeProvider } from "styled-components";
import Navbar from '../components/Navbar'
import styled from 'styled-components';

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Main = styled.main` // make children always take up the space, for the footer to always be at the bottom
  flex: 1;
`;

const baseLayout = {
  layout: {
    wrapperPadding: 'var(--wrapper-padding)',
  },
};

export const lightTheme = {
  colors: {
    background: 'rgb(250, 250, 255)',
    text: 'rgb(28, 28, 42)',
    primary: 'rgb(101, 56, 207)',
    secondary: 'rgb(0, 102, 153)',
    navlink: 'rgb(85, 85, 255)',
    navlinkActive: 'rgb(60, 60, 220)',
    accent: 'rgb(44, 133, 188)',
    hover: {
      primary: 'rgb(116, 59, 248)',
      secondary: 'rgb(0, 122, 185)',
      navlink: 'rgb(60, 90, 255)',
    },
  },
  ...baseLayout,
};

export const darkTheme = {
  colors: {
    background:'rgb(28, 28, 42)',
    text:'rgb(187, 204, 223)',
    primary: 'rgb(101, 56, 207)',
    secondary: 'rgb(44, 133, 188)',
    navlink: 'rgb(47, 47, 208)',
    navlinkActive: 'rgb(69, 69, 255)',
    accent: 'rgb(129, 180, 238)',
    hover: {
      primary: 'rgb(116, 59, 248)',
      secondary: 'rgb(43, 150, 216)',
      navlink: 'rgb(42, 64, 229)',
    },
  },
  ...baseLayout,
};

export default function ThemesWrapper({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <PageLayout>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Main> {children} </Main>
      </PageLayout>
    </ThemeProvider>
  );
}