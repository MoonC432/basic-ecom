import React from "react";
import { useEffect } from "react";
import Accessible from "../layouts/Accessible";
import Authentication from "../layouts/Authentication";
import axios from "../axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import ResponseHandler from "../components/ResponseHandler";
import CurrencyFormat from "react-currency-format";
import "../static/css/Orders.css";
import Pagination from "../components/Pagination";
import { useHistory } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const history = useHistory();

  const dispatch = useDispatch();

  // search algorithm for orders
  useEffect(() => {
    const search_fields = ["id", "date_of_entry", "payment_method"];
    var results = [];
    for (let field in search_fields) {
      for (let order in orders) {
        if (
          String(orders[order][search_fields[field]])
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) &&
          !results.includes(orders[order])
        ) {
          results.push(orders[order]);
        }
      }
    }

    setSearchResults(results);
  }, [searchTerm, orders]);

  // fetch all orders
  useEffect(() => {
    axios
      .get("/order/place-order/", {
        headers: {
          Authorization: `Token ${window.localStorage.getItem("Token")}`,
        },
      })
      .then((response) => {
        setOrders(response.data.response);
      })
      .catch((error) => {
        dispatch({
          type: "SET_RESPONSE_MESSAGE",
          message: error.response,
        });
      });
  }, [dispatch]);
  const indexOfLastProduct = currentPage * 6;
  const indexOfFirstProduct = indexOfLastProduct - 6;
  const currentProducts = searchResults?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  return (
    <Accessible>
      <Authentication enable={true}>
        <div className="orders">
          <ResponseHandler />
          <h3>Your Order History</h3>
          <div className="search">
            <input
              placeholder="Search"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              type="text"
            />
          </div>
          <div className="orders__content">
            {currentProducts.map((order, i) => (
              <div
                onClick={() => {
                  history.push(`/order-details/${order.id}`, order);
                }}
                key={i}
                className="orders__card"
              >
                <span className="order-id">Order Id: {order.id}</span>
                <span className="price">
                  Total Amount :{" "}
                  <CurrencyFormat
                    value={order.total_amt}
                    thousandSeparator={true}
                    prefix="- Rs. "
                    displayType="text"
                  />
                </span>
                <div className="data-row">
                  <span className="method">
                    Payment Method: {order.payment_method}{" "}
                  </span>
                  <span className="gid">
                    {order.generated_id && order.generated_id}
                  </span>
                </div>
                <div className="data-row">
                  <span className="paid">Paid: {String(order.paid)}</span>|
                  <span className="completed">
                    Completed: {String(order.completed)}
                  </span>
                </div>
                <span className="doe">Placed-on: {order.date_of_entry}</span>
                <span className="dod">
                  {order.date_of_delivery &&
                    "Delivery Date : " + order.date_of_delivery}
                </span>
              </div>
            ))}
          </div>
          <Pagination
            totalItems={searchResults?.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </Authentication>
    </Accessible>
  );
}

export default Orders;
