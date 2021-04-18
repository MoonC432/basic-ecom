import React from "react";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import "../static/css/ProductActions.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ProductActions({ product }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const cartProductModel = {
    id: product.id,
    name: product.name,
    model_number: product.model_number,
    price: product.discount_price || product.price,
    picture: product.picture,
    quantity: quantity,
    stock: product.stock,
  };

  const order_list = useSelector((state) => state.cartItems.products);
  const addToCart = () => {
    const checkList = () => {
      var i;
      for (i = 0; i < order_list.length; i++) {
        if (order_list[i].id === product.id) {
          return true;
        }
      }
      return false;
    };
    if (!checkList()) {
      dispatch({
        type: "ADD_TO_CART",
        product: cartProductModel,
      });
    }
  };
  const handleQuantity = (event) => {
    const value = parseInt(event.target.value);
    if (value > product.stock) {
      setQuantity(product.stock);
    } else if (value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
    dispatch({
      type: "SET_QUANTITY",
      product: cartProductModel,
    });
  };
  const incrementQuantity = () => {
    setQuantity(parseInt(quantity) + 1);
    dispatch({
      type: "INCREMENT_QUANTITY",
      product: cartProductModel,
    });
  };
  const decrementQuantity = () => {
    setQuantity(parseInt(quantity) - 1);
    dispatch({
      type: "DECREMENT_QUANTITY",
      product: cartProductModel,
    });
  };
  return (
    <div>
      <div className="actions">
        <div className="quantity">
          <button
            disabled={quantity === 1}
            onClick={decrementQuantity}
            className="minus"
          >
            -
          </button>
          <input value={quantity} onChange={handleQuantity} type="number" />
          <button
            disabled={quantity === product.stock}
            onClick={incrementQuantity}
            className="plus"
          >
            +
          </button>
        </div>
        <div className="cart">
          <button onClick={addToCart}>Add To Cart</button>
          <span className="material-icons">
            {" "}
            <AddShoppingCartIcon />{" "}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductActions;
