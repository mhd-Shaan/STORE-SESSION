import { configureStore } from "@reduxjs/toolkit";
import storeReducer from "./storeslice";
// import contractorReducer from "./contractorslice";

const store = configureStore({
  reducer: {
    store: storeReducer
  },
});

export default store;