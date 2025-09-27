import { createSlice } from "@reduxjs/toolkit";



const ownerSlice = createSlice({
    name: "owner",
    initialState: {
        myShopData: null,
        ownerLoading: true,

    },
    reducers: {
        setMyShopData: (state, action)=> {
            state.myShopData = action.payload
        },
        setOwnerLoading: (state, action)=> {
            state.ownerLoading = action.payload
        },

    }
})

export const {setMyShopData, setOwnerLoading} = ownerSlice.actions

export default ownerSlice.reducer;