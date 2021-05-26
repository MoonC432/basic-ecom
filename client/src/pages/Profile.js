import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ChangePassword from "../components/ChangePassword";
import Accessible from "../layouts/Accessible";
import Authentication from "../layouts/Authentication";
import "../static/css/Profile.css";
import axios from "../axios";

import ResponseHandler from "../components/ResponseHandler";
import { capitalize } from "@material-ui/core";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userAccountInfo.user);
  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? \n*    Clears all order history \n*    Clears all feedbacks \n*    Clears account from our database."
    );
    if (confirmed) {
      axios
        .delete("/account/delete/", {
          headers: {
            Authorization: `Token ${window.localStorage.getItem("Token")}`,
          },
        })
        .then((_) => {
          window.localStorage.setItem("Token", "");
          return window.location.replace("/");
        })
        .catch((error) => {
          dispatch({
            type: "SET_RESPONSE_MESSAGE",
            message: error.response,
          });
        });
    }
  };
  if (!user) return null;

  return (
    <Authentication enable={true}>
      <Accessible>
        <div className="profile">
          <h3>Profile Information</h3>
          <ResponseHandler />
          <div className="content">
            <p className="provider">Account Provider : {user.provider}</p> */}
            <table>
              <tbody>
                <tr>
                  <td>First Name</td>
                  <td>{user.first_name}</td>
                </tr>
                <tr>
                  <td>Last Name</td>
                  <td>{user.last_name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td>Subscribed to newsletter</td>
                  <td>{capitalize(String(user.subscribed))}</td>
                </tr>
                <tr>
                  <td>Account provider</td>
                  <td>{user.provider}</td>
                </tr>
              </tbody>
            </table>
            <div className="password">
              {user.provider === "default" ? <ChangePassword /> : null}
            </div>
            <button onClick={handleDelete} className="delete btn btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </Accessible>
    </Authentication>
  );
}

export default Profile;
