import { combineReducers, createStore } from "redux";
import loadingScreen from "./reducers/loadingScreen";
import responseHandler from "./reducers/responseHandler";
import userAccountInfo from "./reducers/userAccountInfo";
import searchResults from "./reducers/searchResults";
import cartItems from "./reducers/cartItems";

const rootReducer = combineReducers({
  loadingScreen: loadingScreen,
  responseHandler: responseHandler,
  userAccountInfo: userAccountInfo,
  searchResults: searchResults,
  cartItems: cartItems,
});

const store = createStore(rootReducer);

export default store;
