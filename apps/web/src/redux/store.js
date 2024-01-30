import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import positionSlice from "./positionSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    position: positionSlice
  },
});
