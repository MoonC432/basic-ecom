import axios from "../axios";
import React, { useState } from "react";
import "../static/css/Login.css";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import ResponseHandler from "../components/ResponseHandler";
import Authentication from "../layouts/Authentication";
import Accessible from "../layouts/Accessible";
import GoogleBtn from "../components/GoogleBtn";

function Login() {
  const [formData, setFormData] = useState();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleFormData = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("/account/login/", formData)
      .then((response) => {
        dispatch({
          type: "SET_USER_ACCOUNT_INFO",
          payload: response.data.payload,
        });

        window.localStorage.setItem("Token", response.data.token);
        history.push("/");
        dispatch({
          type: "SET_SUBSCRIBE",
          open: true,
        });
      })
      .catch((error) => {
        dispatch({ type: "SET_RESPONSE_MESSAGE", message: error.response });
      });
  };

  return (
    <Authentication enable={false}>
      <Accessible>
        <div className="login">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-12">
              <label htmlFor="username" className="form-label">
                Email Address
              </label>
              <input
                required
                onChange={handleFormData}
                type="email"
                id="username"
                className="form-control"
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                required
                onChange={handleFormData}
                type="password"
                id="password"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary col-md-12">
              Submit
            </button>
          </form>
          <GoogleBtn buttonText="Login with Google" />
          <ResponseHandler />

          <div className="login__links">
            <div className="login__link">
              <span>Don't have an account?</span>
              <Link to="/register">Create an account</Link>
            </div>
            <div className="login__link">
              <span>Forgot password?</span>
              <Link to="/password-reset">Reset password</Link>
            </div>
          </div>
        </div>
      </Accessible>
    </Authentication>
  );
}

export default Login;
