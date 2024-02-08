import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import positionSlice from "./positionSlice";
import productSlice from "./productSlice";
import stockSlice from "./stockSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    position: positionSlice,
    product: productSlice,
    stock: stockSlice
  },
});
