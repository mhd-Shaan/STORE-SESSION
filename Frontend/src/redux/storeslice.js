import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  store: null,
  registrationStep:1,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    loginstore: (state, action) => {
      console.log("user Data Received in Redux:", action.payload); 
      state.store = action.payload;
    },
    logoutstore: (state) => {
      state.store = null;
      
    },
    updateRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
  },
});

export const {loginstore,logoutstore,updateRegistrationStep}=storeSlice.actions;
export default storeSlice.reducer;