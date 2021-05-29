import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import CurrencyFormat from "react-currency-format";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import axios from "../axios";
import Accessible from "../layouts/Accessible";
import Authentication from "../layouts/Authentication";
import "../static/css/OrderDetails.css";

function OrderDetails(props) {
  const orderDetails = props.location.state;
  const { oid } = useParams();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios
      .get(`/order/get-order-details/${oid}/`, {
        headers: {
          Authorization: `Token ${window.localStorage.getItem("Token")}`,
        },
      })
      .then((response) => {
        setProductList(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [oid]);
  return (
    <Accessible>
      <Authentication enable={true}>
        <div className="orderDetails">
          <h4 className="orderId">Order Id : {orderDetails.id}</h4>

          <span className="price">
            Total Amount :{" "}
            <CurrencyFormat
              value={orderDetails.total_amt}
              thousandSeparator={true}
              prefix="- Rs. "
              displayType="text"
            />
          </span>
          <span className="method">
            Payment Method : {orderDetails.payment_method}{" "}
            {orderDetails.generated_id}
          </span>
          <div className="status">
            <h5>Order Status</h5>
            <span className="paid">Paid : {String(orderDetails.paid)}</span>
            <span className="completed">
              Completed : {String(orderDetails.completed)}
            </span>
          </div>
          <div className="orderDates">
            <span className="doe">
              Placed-on : {orderDetails.date_of_entry}
            </span>
            <span className="dod">
              {orderDetails.date_of_delivery &&
                "Delivery date : " + orderDetails.date_of_delivery}
            </span>
          </div>
          <div className="productList">
            <h4 className="title">Items</h4>
            {productList.map((product, i) => (
              <div key={i} className="productRow">
                <span className="name">
                  {product.name} {product.model_number && product.model_number}
                </span>
                <span className="quantity">Quantity : {product.quantity}</span>
                <span className="price">
                  <CurrencyFormat
                    value={product.price}
                    thousandSeparator={true}
                    prefix=" Rs. "
                    displayType="text"
                  />
                </span>
              </div>
            ))}
          </div>
          <Link to="/orders">
            <button className="btn btn-secondary">Go back</button>
          </Link>
        </div>
      </Authentication>
    </Accessible>
  );
}

export default OrderDetails;
