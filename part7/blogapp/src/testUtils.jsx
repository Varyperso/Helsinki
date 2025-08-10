import { MemoryRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './app/ThemesWrapper'
import { render } from '@testing-library/react';
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice'
import blogsReducer from './features/blogs/blogsSlice'

export const renderWithTheme = ui => {
  return render(<MemoryRouter><ThemeProvider theme={lightTheme}>{ui}</ThemeProvider></MemoryRouter>);
};

export const renderWithRedux = (ui, { preloadedState, store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogsReducer,
  },
  preloadedState,
}) } = {}) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={lightTheme}>
          {ui}
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};