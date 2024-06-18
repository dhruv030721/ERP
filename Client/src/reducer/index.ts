import { combineReducers } from "@reduxjs/toolkit";
import { authSlice, academicSlice } from "../slices/index";

const rootReducer = combineReducers({
  auth: authSlice,
  academic: academicSlice
});

export default rootReducer;
