import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarMode: 'open', // 'open' | 'openSmall' | 'mini' | 'closed'
  darkMode: true,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarMode: (state, action) => {
      state.sidebarMode = action.payload
    },
    toggleDarkMode: (state, action) => {
      state.darkMode = action.payload
    },
  },
})

export const { setSidebarMode, toggleDarkMode } = uiSlice.actions
export default uiSlice.reducer