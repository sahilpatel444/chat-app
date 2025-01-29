import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Use localStorage as default
import { persistReducer } from "redux-persist";

const initialState = {
  _id: "",
  name: "",
  email: "",
  token: "",
  onlineUser: [],
  // socketConnection: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state, action) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.token = "";
      state.socketConnection = null;
      // state.socketConnection = null; // ✅ Ensure it's cleared on logout

       // Clear persisted state
      //  storage.removeItem("persist:root");
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } =
  userSlice.actions;

  // Redux Persist Configuration
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["_id", "name", "email", "token", "onlineUser"],
};

// export default userSlice.reducer;
export default persistReducer(persistConfig,userSlice.reducer)
