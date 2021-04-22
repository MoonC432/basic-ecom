import axios from "../axios";
import React from "react";
import { useState, useEffect } from "react";
import Carousel from "react-elastic-carousel";

import ProductCard from "./ProductCard";
import "../static/css/LatestProducts.css";

function LatestProducts(props) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get("/product/select/latest/6/") // 6 = length of product list
      .then((response) => {
        setProducts(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const breakpoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];
  return (
    <div className="latestProducts">
      <h3>Latest Products</h3>
      <div className="productList">
        <Carousel showArrows={false} breakPoints={breakpoints}>
          {products.map((product, i) => (
            <ProductCard key={i} productInfo={product} />
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default LatestProducts;
