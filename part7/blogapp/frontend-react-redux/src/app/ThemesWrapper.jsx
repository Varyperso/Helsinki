import { ThemeProvider } from "styled-components";
import Navbar from '../components/Navbar'
import styled from 'styled-components';
import { useSelector } from "react-redux";

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bgDark};
  color: ${({ theme }) => theme.colors.text};
  transition: 0.3s ease;
`;

const baseLayout = {
  layout: {
    wrapperPadding: 'var(--wrapper-padding)',
  },
};

export const lightTheme = {
  colors: {
    bgDark: 'oklch(0.72 0.03 265)',
    bg: 'oklch(0.82 0.04 265)',
    bgLight: 'oklch(0.93 0.04 265)',
    bgAccent: 'oklch(0.92 0.12 265)',
    textDark: 'oklch(0.16 0.02 265)',
    text: 'oklch(0.19 0.04 265)',
    textLight: 'oklch(0.24 0.06 265)',
    textAccent: 'oklch(0.32 0.08 265)',
    navlink: {
      bg: 'rgb(47, 47, 208)',
      bgHover: 'rgb(42, 64, 229)',
      bgActive: 'rgb(69, 69, 255)',
      textActive: 'rgb(22, 22, 15)',
    },
    button: {
      primary: 'oklch(0.71 0.18 276)',
      primaryHover: 'oklch(0.68 0.19 276)',
      secondary: 'oklch(0.73 0.09 256)',
      secondaryHover: 'oklch(0.7 0.1 256)',
    },
    dark: {
      brown: 'oklch(0.27 0.05 96)',
    },
    light: {
      beige: 'oklch(0.78 0.05 96)',
      brown: 'oklch(0.44 0.08 96)',
    },
    brown: 'oklch(0.35 0.07 96)',
  },
  ...baseLayout,
};

export const darkTheme = {
  colors: {
    bgDark: 'oklch(0.17 0.02 265)',
    bg: 'oklch(0.20 0.03 265)',
    bgLight: 'oklch(0.24 0.05 265)',
    bgAccent: 'oklch(0.32 0.08 265)',
    textDark: 'oklch(0.70 0.03 265)',
    text: 'oklch(0.80 0.04 265)',
    textLight: 'oklch(0.93 0.04 265)',
    textAccent: 'oklch(0.94 0.12 265)',
    button: {
      primary: 'oklch(0.29 0.18 276)',
      primaryHover: 'oklch(0.32 0.19 276)',
      secondary: 'oklch(0.27 0.09 256)',
      secondaryHover: 'oklch(0.3 0.1 256)',
    },
    dark: {
      brown: 'oklch(0.27 0.05 96)',
    },
    light: {
      beige: 'oklch(0.78 0.05 96)',
      brown: 'oklch(0.44 0.08 96)',
    },
    brown: 'oklch(0.35 0.07 96)',
  },
  ...baseLayout,
};

export default function ThemesWrapper({ children }) {
  const darkMode = useSelector(state => state.ui.darkMode)
  const sidebarMode = useSelector(state => state.ui.sidebarMode)

  const baseTheme = darkMode ? darkTheme : lightTheme;

  const theme = {
    ...baseTheme,
    layout: {
      ...baseTheme.layout,
      sidebarWidth: (sidebarMode === 'open' || sidebarMode === 'openSmall') ? '8rem' : sidebarMode === 'mini' ? '2.5rem' : '0rem',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Navbar />
        {children}
      </PageLayout>
    </ThemeProvider>
  );
}

