import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

function Authentication(props) {
  const user = useSelector((state) => state.userAccountInfo.user);
  const history = useHistory();

  if (props.enable) {
    if (!user || user === null) {
      history.push("/login");
      return null;
    }
    return <div>{props.children}</div>;
  } else {
    if (user) {
      history.push("/");
      return null;
    }
    return <div>{props.children}</div>;
  }
}

export default Authentication;
