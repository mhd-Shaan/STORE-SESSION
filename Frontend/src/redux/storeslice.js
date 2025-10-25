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
      state.store = action.payload;
      
    },
    logoutstore: (state) => {
      state.store = null;
      
    },
     setStoreLocation: (state, action) => {
      state.location = action.payload;
    },
    updateRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
  },
});

export const {loginstore,logoutstore,updateRegistrationStep,setStoreLocation}=storeSlice.actions;
export default storeSlice.reducer;