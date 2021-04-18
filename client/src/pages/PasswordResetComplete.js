import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ResponseHandler from "../components/ResponseHandler";
import Accessible from "../layouts/Accessible";
import Authentication from "../layouts/Authentication";
import "../static/css/PasswordResetComplete.css";

function PasswordResetComplete() {
  const { uidb64, token } = useParams();
  const [formData, setFormData] = useState({ uidb64, token });
  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    await axios
      .patch("/account/password-reset-complete/", formData)
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
        <div className="passwordResetComplete">
          <h1>Password Reset Complete</h1>
          <form onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                onChange={handleFormChange}
                type="password"
                id="password"
                className="form-control"
                required
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="password2" className="form-label">
                Confirm Password
              </label>
              <input
                onChange={handleFormChange}
                type="password"
                id="password2"
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary col-md-4">
              Submit
            </button>
          </form>
          <ResponseHandler />
        </div>
      </Accessible>
    </Authentication>
  );
}

export default PasswordResetComplete;
