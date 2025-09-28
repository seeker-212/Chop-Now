import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
    currentAddress: null,
    loading: true,
    shopInMyCity: null,
    itemInMyCity: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemInMyCity: (state, action) => {
      state.itemInMyCity = action.payload;
    },
  },
});

export const {
  setUserData,
  setCity,
  setLoading,
  setState,
  setCurrentAddress,
  setShopInMyCity,
  setItemInMyCity,
} = userSlice.actions;

export default userSlice.reducer;
