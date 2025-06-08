import { createSlice } from "@reduxjs/toolkit";
const connectionSlice = createSlice({
    name: "connections",
    initialState: {
        followers: [],
        followings: []
    },
    reducers: {
        setFollowers: (state, action) => {
            state.followers = action.payload;
        },
        setFollowings: (state, action) => {
            state.followings = action.payload;
        },
    }
})
export const { setFollowers, setFollowings } = connectionSlice.actions;
export default connectionSlice.reducer;