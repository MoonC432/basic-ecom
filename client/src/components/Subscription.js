import React from "react";
import { useDispatch } from "react-redux";
import axios from "../axios";

function Subscription() {
  const dispatch = useDispatch();
  const subscribe = () => {
    axios
      .get("/account/subscribe/", {
        headers: {
          Authentication: `Token ${window.localStorage.getItem("Token")}`,
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
  subscribe();
  return <div>Subscribe?</div>;
}

export default Subscription;
