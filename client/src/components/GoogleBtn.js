import axios from "../axios";
import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

const CLIENT_ID =
  "157713233538-hr1r3v9kqj4o30cr9kp6f7e05fmvlbnb.apps.googleusercontent.com";

function GoogleBtn({ buttonText }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const login = (googleResponse) => {
    if (googleResponse.accessToken) {
      const payloadData = {
        email: googleResponse.profileObj.email,
        first_name: googleResponse.profileObj.name,
        last_name: googleResponse.profileObj.familyName,
      };
      axios
        .post("/account/google/", {
          access_token: googleResponse.accessToken,
        })
        .then((response) => {
          dispatch({
            type: "SET_USER_ACCOUNT_INFO",
            payload: payloadData,
          });
          window.localStorage.setItem("Token", response.data.key);
          history.push("/");
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
