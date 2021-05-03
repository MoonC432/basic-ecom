import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetComplete from "./pages/PasswordResetComplete";
import LoadingScreen from "./components/LoadingScreen";
import Checkout from "./pages/Checkout";
import ProductInfo from "./pages/ProductInfo";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";
import SearchResults from "./pages/SearchResults";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import Subscription from "./components/Subscription";

function App() {
  // login user if token available
  const user = useSelector((state) => state.userAccountInfo.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      axios
        .get("/account/login/", {
          headers: {
            Authorization: `Token ${window.localStorage.getItem("Token")}`,
          },
        })
        .then((response) => {
          dispatch({
            type: "SET_USER_ACCOUNT_INFO",
            payload: response.data.payload,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route
            exact
            path="/password-reset-complete/:uidb64/:token"
            component={PasswordResetComplete}
          />
          <Route exact path="/password-reset" component={PasswordReset} />
          <Route exact path="/product/detail/:id" component={ProductInfo} />
          <Route
            exact
            path="/product/search-results"
            component={SearchResults}
          />
          <Route exact path="/checkout" component={Checkout} />
          <Route exact path="/payment" component={Payment} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/" component={Home} />
        </Switch>
        <LoadingScreen />
        <Subscription />
      </BrowserRouter>
    </div>
  );
}

export default App;
