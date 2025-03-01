import { createSlice } from "@reduxjs/toolkit";


const loadAuthState = () => {
  try {
    const storedState = localStorage.getItem("authState");
    return storedState ? JSON.parse(storedState) : { status: false, userData: null };
  } catch (err) {
    console.error("Failed to load auth state:", err);
    return { status: false, userData: null };
  }
};

const initialState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      localStorage.setItem("authState", JSON.stringify(state)); // Save to localStorage
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("authState"); // Remove from localStorage on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
