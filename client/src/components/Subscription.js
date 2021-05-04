import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import ReactDom from "react-dom";
import "../static/css/Subscription.css";
import ResponseHandler from "./ResponseHandler";

function Subscription() {
  const open = useSelector((state) => state.portalState.openSubscribe);
  const alreadySubscribed = useSelector((state) => state.userAccountInfo.user)
    ?.subscribed;

  const dispatch = useDispatch();
  const subscribe = () => {
    axios
      .get("/account/subscription/", {
        headers: {
          Authorization: `Token ${window.localStorage.getItem("Token")}`,
        },
      })
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
  };
  const handleClose = () => {
    dispatch({
      type: "SET_SUBSCRIBE",
      open: false,
    });
  };
  if (!open) return null;
  if (alreadySubscribed) return null;
  return ReactDom.createPortal(
    <>
      f
      <div className="overlay" />
      <div className="subscription">
        <div className="header">
          <h3>Brand Name</h3>
          <span onClick={handleClose}>X</span>
        </div>
        <h4>Subscribe to our NewsLetter ? </h4>
        <p>
          You will recieve notifications whenever new product or event is added
          in your E-mail.
        </p>
        <div className="buttons">
          <button
            onClick={() => {
              subscribe();
            }}
            className="submit primary_btn"
          >
            Yes, I am in
          </button>
          <button onClick={handleClose} className="cancel btn btn-secondary">
            Close
          </button>
        </div>
        <ResponseHandler />
      </div>
    </>,
    document.getElementById("portal")
  );
}

export default Subscription;
