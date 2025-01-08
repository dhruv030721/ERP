// In your reducer/index.ts file
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/auth";
import academicReducer from "../slices/academics";

const appReducer = combineReducers({
  auth: authReducer,
  academic: academicReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;