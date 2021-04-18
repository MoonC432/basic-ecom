import React from "react";
import "../static/css/ProductCard.css";
import Price from "./Price";
import { useHistory } from "react-router";
import ProductActions from "./ProductActions";

function ProductCard({ productInfo }) {
  const history = useHistory();
  const linkToProductDetails = () => {
    history.push(`/product/detail/${productInfo.id}`);
  };
  return (
    <div className="productCard">
      <h5 className="productCard__title">
        {productInfo.name}{" "}
        {productInfo.model_number && productInfo.model_number}
      </h5>
      <img
        src={process.env.REACT_APP_SERVER_API + productInfo.picture}
        alt=""
      />
      <div className="productCard flex-row">
        <div className="rating">
          Rating: <span>{parseFloat(productInfo.rating).toFixed(1)} </span>
        </div>
        <span className="link-detail" onClick={linkToProductDetails}>
          View Details
        </span>
      </div>

      <Price
        discount_price={productInfo.discount_price}
        price={productInfo.price}
      />
      <ProductActions product={productInfo} />
    </div>
  );
}

export default ProductCard;
