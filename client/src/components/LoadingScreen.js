import React from "react";
import ReactDom from "react-dom";
import { useSelector } from "react-redux";
import "../static/css/LoadingScreen.css";

function LoadingScreen() {
  const loading = useSelector((state) => state.loadingScreen.loading);
  if (!loading) return null;
  return ReactDom.createPortal(
    <>
      <div className="overlay" />

      <div className="loadingScreen">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}

export default LoadingScreen;
