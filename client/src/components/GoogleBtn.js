import axios from "../axios";
import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function GoogleBtn({ buttonText }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const login = (googleResponse) => {
    if (googleResponse.accessToken) {
      // user info @ googleResponse.profileObj
      axios
        .post("/account/google/", {
          access_token: googleResponse.accessToken,
        })
        .then((response) => {
          axios
            .get("/account/login/", {
              headers: {
                Authorization: `Token ${response.data.key}`,
              },
            })
            .then((callbackResponse) => {
              dispatch({
                type: "SET_USER_ACCOUNT_INFO",
                payload: callbackResponse.data.payload,
              });
              window.localStorage.setItem("Token", response.data.key);
              history.push("/");

              dispatch({
                type: "SET_SUBSCRIBE",
                open: true,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          dispatch({ type: "SET_RESPONSE_MESSAGE", message: error.response });
        });
    }
  };

  function handleLoginFailure(response) {
    dispatch({ type: "SET_RESPONSE_MESSAGE", message: response.message });
  }

  return (
    <div>
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText={buttonText}
        onSuccess={login}
        onFailure={handleLoginFailure}
        cookiePolicy={"single_host_origin"}
        responseType="code,token"
      />
    </div>
  );
}

export default GoogleBtn;
