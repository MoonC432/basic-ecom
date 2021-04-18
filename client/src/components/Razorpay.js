import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import axios from "../axios";
import ResponseHandler from "./ResponseHandler";

function Razorpay({ orderData, orderResponse, getTotal }) {
  const user = useSelector((state) => state.userAccountInfo.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const razorpayOptions = {
    key: process.env.REACT__APP_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
    amount: getTotal * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Brand Name",
    description: "Test Transaction",
    image:
      "https://www.feedough.com/wp-content/uploads/2016/09/brand-image.webp",
    order_id: orderResponse.response.generated_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      axios
        .post("/payment/razorpay/verify/", {
          order_id: orderResponse.response.order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        })
        .then((response) => {
          if (response.status === 200) {
            history.push("/orders");
            dispatch({
              type: "CLEAR_CART",
            });
          }
        })
        .catch((error) => {
          dispatch({
            type: "SET_RESPONSE_MESSAGE",
            message: error.response,
          });
        });
    },
    prefill: {
      name: user.first_name + " " + user.last_name,
      email: user.email,
      contact: orderData.phone,
    },
    notes: {
      address: orderData.address,
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new window.Razorpay(razorpayOptions);
  rzp1.on("payment.failed", function (response) {
    alert(response.error.description);
  });

  return (
    <div className="razorpay primary_btn">
      <button
        onClick={() => {
          rzp1.open();
        }}
        id="rzp-button1"
      >
        Pay with Razorpay
      </button>
      <ResponseHandler />
    </div>
  );
}

export default Razorpay;
