import React, { useState } from "react";
import "../static/css/PasswordReset.css";
import axios from "../axios";
import { useDispatch } from "react-redux";
import ResponseHandler from "../components/ResponseHandler";
import Authentication from "../layouts/Authentication";
import Accessible from "../layouts/Accessible";

function PasswordReset() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState();
  const handleFormData = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    await axios
      .post("/account/request-reset-email/", formData)
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
        <div className="passwordReset">
          <h1>Reset Password Through Email</h1>
          <form onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                onChange={handleFormData}
                type="email"
                id="email"
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

export default PasswordReset;
