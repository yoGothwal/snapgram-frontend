import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist"
import { thunk } from "redux-thunk";

import chatReducer from "./features/chatSlice"
import userReducer from "./features/userSlice"
import connectionReducer from "./features/connectionSlice"

import storage from "redux-persist/lib/storage"
const persistConfig = {
    key: "root",
    storage
}
const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
    connection: connectionReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});
export const persistor = persistStore(store);
