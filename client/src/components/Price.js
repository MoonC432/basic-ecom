import React from "react";
import "../static/css/Price.css";
import * as CurrencyFormat from "react-currency-format";

function Price({ discount_price, price }) {
  return (
    <div className="price">
      {discount_price && (
        <span className="main_price line">
          <CurrencyFormat
            value={price}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"Rs."}
          />
        </span>
      )}
      <span className="discount_price">
        <CurrencyFormat
          value={discount_price ? discount_price : price}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rs."}
        />
      </span>
    </div>
  );
}

export default Price;
