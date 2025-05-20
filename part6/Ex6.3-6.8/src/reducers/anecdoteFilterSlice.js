import { createSlice } from '@reduxjs/toolkit'

const anecdoteFilterSlice = createSlice({
  name: 'anecdoteFilter',
  initialState: "",
  reducers: {
    anecdoteFilter(state, action) {
      return action.payload;
    }
  }
})

export const { anecdoteFilter }  = anecdoteFilterSlice.actions
export default anecdoteFilterSlice.reducer