import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        token: null,
        coords: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.coords = action.payload.coords;
        },
        clearUser: (state) => {
            state.user = null;
            state.token = null;
            state.coords = null;
        }
    }
})
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;