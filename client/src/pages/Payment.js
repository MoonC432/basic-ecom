import React from "react";
import Razorpay from "../components/Razorpay";
import Paypal from "../components/Paypal";
import CurrencyFormat from "react-currency-format";
import Authentication from "../layouts/Authentication";
import Accessible from "../layouts/Accessible";
import "../static/css/Payment.css";
import { Link } from "react-router-dom";

function Payment(props) {
  const orderData = props.location.state?.orderData;
  const orderResponse = props.location.state?.orderResponse;
  const getTotal = props.location.state?.getTotal;

  if (!orderData || orderData.length === 0) return null;

  return (
    <Accessible>
      <Authentication enable={true}>
        <div className="payment">
          <h3>Order Details</h3>
          <div className="payment__orderList">
            {orderData.product_list?.map((product, i) => (
              <div key={i} className="data-row">
                <span className="title">
                  {product.name} {product.model_number} (x {product.quantity})
                </span>
                <span className="price">
                  <CurrencyFormat
                    value={product.price}
                    thousandSeparator={true}
                    displayType="text"
                    prefix="- Rs. "
                  />
                </span>
              </div>
            ))}
          </div>
          <div className="payment__data">
            <div className="data-row">Address : {orderData.address}</div>
            <div className="data-row">Contact Number : {orderData.phone}</div>
            <div className="data-row">
              Order Id : {orderResponse.response.order_id}
            </div>
            <div className="data-row">
              Total :{" "}
              <CurrencyFormat
                value={getTotal}
                thousandSeparator={true}
                displayType="text"
                prefix="- Rs. "
              />
            </div>
          </div>
          <Link to="/checkout">Go back and edit</Link>
          {/* render respective payment buttons */}
          <div className="payment__button">
            {orderData.payment_method === "razorpay" ? (
              <Razorpay
                orderData={orderData}
                orderResponse={orderResponse}
                getTotal={getTotal}
              />
            ) : orderData.payment_method === "paypal" ? (
              <Paypal
                orderData={orderData}
                orderResponse={orderResponse}
                getTotal={getTotal}
              />
            ) : null}
            <Link to="/orders">
              <button className="primary_btn">Track your Order</button>
            </Link>
          </div>
          <div className="Information">
            To make payment for the Order: <br />
            Pay with Either Esewa or Online Bank Transfer clearly stating [
            order Id ]. <br />
            Bank Name : (Bank Name)br
            <br />
            Bank Details : xxxx-xxxx-xxxx (Account Holder Name )
          </div>
        </div>
      </Authentication>
    </Accessible>
  );
}

export default Payment;
