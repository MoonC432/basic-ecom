import React from "react";
import Navbar from "../components/Navbar";

function Accessible(props) {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
}

export default Accessible;
