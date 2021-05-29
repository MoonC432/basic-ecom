import React, { useState } from "react";
import "../static/css/Checkout.css";
import * as CurrencyFormat from "react-currency-format";

import Authentication from "../layouts/Authentication";
import Accessible from "../layouts/Accessible";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import ResponseHandler from "../components/ResponseHandler";
import { useHistory } from "react-router";

function Checkout() {
  const [orderData, setOrderData] = useState({ payment_method: "custom" });
  const orderList = useSelector((state) => state.cartItems.products);
  const dispatch = useDispatch();
  const history = useHistory();

  const getTotal = () => {
    return orderList.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const handleOrderData = (event) => {
    setOrderData({
      ...orderData,
      [event.target.id]: event.target.value,
    });
  };
  const handleRemoveProduct = (id) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      id: id,
    });
  };

  const changeQuantity = (product, type, quantity) => {
    if (type === 0) {
      dispatch({
        type: "SET_PRODUCT_QUANTITY",
        product: product,
        quantity: quantity,
      });
    } else if (type === -1) {
      dispatch({
        type: "DECREMENT_QUANTITY",
        product: product,
      });
    } else if (type === 1) {
      dispatch({
        type: "INCREMENT_QUANTITY",
        product: product,
      });
    } else {
      console.log({
        "-1": "decrease by 1",
        "0": "change to a certain value",
        "1": "increase by 1",
      });
    }
  };
  const handleCheckout = (event) => {
    event.preventDefault();

    const allowed = ["id", "name", "model_number", "quantity", "price"];

    orderData.product_list = orderList.map((raw) =>
      Object.keys(raw)
        .filter((key) => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = raw[key];
          return obj;
        }, {})
    );

    axios
      .post("/order/place-order/", orderData, {
        headers: {
          Authorization: `Token ${window.localStorage.getItem("Token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          history.push("/payment", {
            orderData,
            orderResponse: response.data,
            getTotal: getTotal(),
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: error.response,
        });
      });
  };
  return (
    <Authentication enable={true}>
      <Accessible>
        <div className="checkout">
          <h3>Checkout</h3>
          <div className="content">
            <div className="checkout__list">
              {orderList.length === 0 ? (
                <p>No Items Added in the cart</p>
              ) : (
                orderList.map((product, i) => (
                  <div key={i} className="itemList">
                    <img
                      src={process.env.REACT_APP_SERVER_API + product.picture}
                      alt=""
                    />
                    <div className="data">
                      <div className="title">
                        <p>
                          {product.name} {product.model_number}
                        </p>
                        <div className="quantity">
                          <button
                            onClick={() => {
                              changeQuantity(product, -1);
                            }}
                          >
                            -
                          </button>
                          <input
                            onClick={(event) => {
                              event.target.select();
                            }}
                            onChange={(event) => {
                              changeQuantity(product, 0, event.target.value);
                            }}
                            value={product.quantity}
                            type="number"
                          />
                          <button
                            onClick={() => {
                              changeQuantity(product, 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="price">
                          Price :{" "}
                          <span>
                            {
                              <CurrencyFormat
                                value={product.price}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"- Rs. "}
                              />
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex-column">
                        <div className="subtotal">
                          Sub-total :{" "}
                          <span>
                            {
                              <CurrencyFormat
                                value={product.price * product.quantity}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Rs. "}
                              />
                            }
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            handleRemoveProduct(product.id);
                          }}
                          className="remove"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="checkout__details">
              <h4>Checkout Details</h4>
              <div className="details">
                <p>
                  Sub-total :{" "}
                  <span>
                    <CurrencyFormat
                      value={getTotal()}
                      thousandSeparator={true}
                      prefix="Rs. "
                      displayType="text"
                    />
                  </span>
                </p>
                <p>
                  Shipping : <span>Rs. 00000</span>
                </p>

                <p>
                  Total (Tax inclusive) :{" "}
                  <span>
                    <CurrencyFormat
                      value={getTotal()}
                      thousandSeparator={true}
                      prefix="Rs. "
                      displayType="text"
                    />
                  </span>
                </p>
              </div>
              <form onSubmit={handleCheckout} className="details__form">
                <div className="form-row">
                  <input
                    onChange={handleOrderData}
                    id="address"
                    placeholder="Shipping address (Detail)"
                    type="text"
                  />
                </div>
                <div className="form-row">
                  <input
                    onChange={handleOrderData}
                    id="phone"
                    placeholder="Contact number"
                    type="text"
                  />
                </div>
                {/* <div className="form-row">
                  <select
                    defaultValue="default"
                    onChange={handleOrderData}
                    id="payment_method"
                    type="text"
                  >
                    <option value="default">Select a Method</option>
                    <option value="paypal">Paypal</option>
                    <option value="razorpay">Razorpay</option>
                  </select>
                </div> */}
                <button type="submit" className="submit primary_btn">
                  Proceed to payment
                </button>
              </form>
              <ResponseHandler />
            </div>
          </div>
        </div>
      </Accessible>
    </Authentication>
  );
}

export default Checkout;
