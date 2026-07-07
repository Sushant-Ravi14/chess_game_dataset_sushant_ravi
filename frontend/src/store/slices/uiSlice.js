import { createSlice } from '@reduxjs/toolkit';

const initialTheme = localStorage.getItem('theme') || 'dark';
const initialHighContrast = localStorage.getItem('highContrast') === 'true';

const initialState = {
  theme: initialTheme, // 'light' or 'dark'
  highContrast: initialHighContrast,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
      localStorage.setItem('highContrast', state.highContrast);
    }
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen, toggleHighContrast } = uiSlice.actions;
export default uiSlice.reducer;
