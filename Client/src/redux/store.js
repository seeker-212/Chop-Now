import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import ownerSlice from "./ownerSlice.js";
import mapSlice from "./mapSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

//  Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "owner", "map"],
};

//  Combine all reducers
const rootReducer = combineReducers({
  user: userSlice,
  owner: ownerSlice,
  map: mapSlice,
});

//  Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

// Create persistor for the store
export const persistor = persistStore(store);
