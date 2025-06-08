import { createSlice } from "@reduxjs/toolkit"
const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        onlineUsers: [],
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    }
})
export const { addMessage, setMessages, setOnlineUsers } = chatSlice.actions
export default chatSlice.reducer