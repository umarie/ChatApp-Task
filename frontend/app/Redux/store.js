"use client";
import { combineReducers, configureStore  } from "@reduxjs/toolkit";
import userReducer from "../Redux/userSlice"


const rootReducer = combineReducers({
 user: userReducer,

  //add all your reducers here
},);

export const store = configureStore({
 reducer: rootReducer,
 });