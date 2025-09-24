import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        city: null,
        state: null,
        currentAddress: null,
        loading: true
    },
    reducers: {
        setUserData: (state, action)=> {
            state.userData = action.payload
        },

        setCity: (state, action) => {
            state.city = action.payload
        },
        setState: (state, action) => {
            state.state = action.payload
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const {setUserData, setCity, setLoading, setState, setCurrentAddress} = userSlice.actions

export default userSlice.reducer;