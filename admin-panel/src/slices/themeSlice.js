import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: localStorage.getItem('adminTheme') === 'dark' || 
    (!('adminTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('adminTheme', state.darkMode ? 'dark' : 'light');
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
