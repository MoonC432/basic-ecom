import React, { useEffect } from "react";
import "../static/css/Navbar.css";
import { useHistory } from "react-router-dom";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/Menu";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { HashLink, NavHashLink } from "react-router-hash-link";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const history = useHistory();
  const user = useSelector((state) => state.userAccountInfo.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const orderList = useSelector((state) => state.cartItems.products);

  const dispatch = useDispatch();

  const logout = () => {
    window.localStorage.removeItem("Token");
    return window.location.replace("/");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (searchTerm.length > 0) {
      dispatch({
        type: "SET_SEARCH_RESULTS",
        payload: searchResults,
      });

      history.push("/product/search-results");
      setSearchTerm("");
    }
  };

  const redirectProductDetail = (id) => {
    history.push(`/product/detail/${id}`);
    setSearchTerm("");
  };

  const handleCategoryChange = (event) => {
    axios.get(`/product/search/${event.target.value}/`).then((response) => {
      dispatch({
        type: "SET_SEARCH_RESULTS",
        payload: response.data.response,
      });
      history.push("/product/search-results");
    });
  };
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSearchResults([]);
    } else {
      axios.get(`/product/search/${searchTerm}/`).then((response) => {
        setSearchResults(response.data.response);
      });
    }
  }, [searchTerm]);
  return (
    <nav className="navbar">
      <div
        onClick={() => {
          history.push("/");
        }}
        className="nav-brand"
      >
        <span>Brand Name</span>
      </div>
      <div className="menu">
        <span
          onClick={() => {
            setSidebar(!sidebar);
          }}
          className="material-icons burger"
        >
          {" "}
          <MenuIcon />{" "}
        </span>

        <div className={sidebar ? "nav-elements" : "nav-elements close"}>
          <div className="nav-links">
            <NavHashLink smooth className="link" to="/#top">
              Home
            </NavHashLink>
            <NavHashLink smooth className="link" to="/#latest">
              Latest
            </NavHashLink>

            <NavHashLink smooth className="link" to="/services">
              Services
            </NavHashLink>
          </div>
          <div className="category">
            <select
              onChange={(event) => {
                handleCategoryChange(event);
              }}
              defaultValue="default"
            >
              <option disabled value="default">
                Category
              </option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="monitor">Monitor</option>
              <option value="printer">Printer</option>
              <option value="network">Network</option>
              <option value="other">Other</option>
            </select>
          </div>
          <form
            onSubmit={handleSearchSubmit}
            type="submit"
            className="nav-search"
          >
            <input
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              value={searchTerm}
              placeholder="Search"
              type="text"
            />
            <button className="material-icons">
              {" "}
              <SearchIcon />{" "}
            </button>
            <ul className="nav-search_results">
              {searchTerm.length > 0 && searchResults.length === 0 ? (
                <li>No Results Found</li>
              ) : (
                searchResults.map((product, i) => (
                  <li
                    onClick={() => {
                      redirectProductDetail(product.id);
                    }}
                    className="result"
                    key={i}
                  >
                    {product.name} {product.model_number}
                  </li>
                ))
              )}
            </ul>
          </form>
          {user && user !== null ? (
            <div className="nav-settings">
              <div className="nav-profile">
                <button>
                  {user.first_name} {user.last_name}
                  {/* {user.email} */}
                </button>
                <span className="material-icons">
                  {" "}
                  <ExpandMoreIcon />{" "}
                </span>
              </div>
              <ul className="settings-options">
                <li
                  onClick={() => {
                    history.push("/profile");
                  }}
                  className="option"
                >
                  Profile
                </li>
                <li
                  onClick={() => {
                    history.push("/orders");
                  }}
                  className="option"
                >
                  Orders
                </li>
                <li onClick={logout} className="option">
                  Logout
                </li>
              </ul>
            </div>
          ) : (
            <div
              onClick={() => {
                history.push("/login");
              }}
              className="nav-login"
            >
              Login
            </div>
          )}
        </div>
      </div>

      <HashLink to="/checkout" className="material-icons cart">
        <span className="cart_length">
          {orderList.length !== 0 ? orderList.length : null}
        </span>
        <ShoppingCartIcon />
      </HashLink>
    </nav>
  );
}

export default Navbar;
