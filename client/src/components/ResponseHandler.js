import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function ResponseHandler() {
  const response = useSelector((state) => state.responseHandler.response);
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "SET_RESPONSE_MESSAGE", message: null });
    }, 5000);
  }, [dispatch, response]);

  const renderContentResponse = () => {
    if (response && response !== null) {
      if (response.status === 200) {
        return (
          <p className="alert alert-success" role="alert">
            {response.data.response}
          </p>
        );
      } else {
        return (
          <p className="alert alert-danger" role="alert">
            {response.data.detail ||
              response.data.error ||
              response.data[Object.keys(response.data)[0]]}
          </p>
        );
      }
    } else {
      return null;
    }
  };
  return <div>{renderContentResponse()}</div>;
}

export default ResponseHandler;
