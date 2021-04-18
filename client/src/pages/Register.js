import React, { useState } from "react";
import "../static/css/Register.css";
import axios from "../axios";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import ResponseHandler from "../components/ResponseHandler";
import Authentication from "../layouts/Authentication";
import Accessible from "../layouts/Accessible";
import GoogleLogin from "react-google-login";

function Register() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState();

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event, uri) => {
    event.preventDefault();
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    await axios
      .post(`/account/${uri}/`, formData)
      .then((response) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: error.response,
        });
      });
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
  };

  return (
    <Authentication enable={false}>
      <Accessible>
        <div className="register">
          <h1>Register an Account</h1>
          <form
            onSubmit={(event) => {
              handleSubmit(event, "register");
            }}
            className="row g-3"
          >
            <div className="col-md-6">
              <label htmlFor="first_name" className="form-label">
                First Name
              </label>
              <input
                required
                onChange={handleFormChange}
                type="text"
                id="first_name"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="last_name" className="form-label">
                Last Name
              </label>
              <input
                required
                onChange={handleFormChange}
                type="text"
                id="last_name"
                className="form-control"
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                required
                onChange={handleFormChange}
                type="email"
                id="email"
                className="form-control"
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                required
                onChange={handleFormChange}
                type="password"
                id="password"
                className="form-control"
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="password2" className="form-label">
                Confirm Password
              </label>
              <input
                required
                onChange={handleFormChange}
                type="password"
                id="password2"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary col-md-12">
              Submit
            </button>
          </form>
          <GoogleLogin buttonText="Sign-In with Google" />
          <ResponseHandler />
          <div className="register__links">
            <div className="register__link">
              <span>Already have an account?</span>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </Accessible>
    </Authentication>
  );
}

export default Register;
