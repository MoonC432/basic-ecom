import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import axios from "../axios";

function ChangePassword() {
  const dispatch = useDispatch();
  const [passForm, setPassForm] = useState({});
  const handlePassChange = (event) => {
    setPassForm({ ...passForm, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .patch("/account/change-password/", passForm, {
        headers: {
          Authorization: `Token ${window.localStorage.getItem("Token")}`,
        },
      })
      .then((response) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: response,
        });
        event.target.reset();
      })
      .catch((error) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: error.response,
        });
      });
  };
  return (
    <div>
      <h4>Change Password</h4>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Old password"
          type="password"
          name="old_password"
          onChange={handlePassChange}
        />
        <input
          placeholder="New Password"
          type="password"
          name="new_password"
          onChange={handlePassChange}
        />
        <input
          placeholder="Confirm assword"
          type="password"
          name="confirm_password"
          onChange={handlePassChange}
        />
        <button className="primary_btn">Submit</button>
      </form>
    </div>
  );
}

export default ChangePassword;
