// src/redux/reducer/index.js
import { combineReducers } from "redux";
import auth from "./authSlice";
import handleCart from "./handleCart";

const rootReducers = combineReducers({
  auth,
  handleCart,
});

export default rootReducers;
