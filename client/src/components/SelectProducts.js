import React from "react";
import "../static/css/SelectProducts.css";
import axios from "../axios";
import { useState, useEffect } from "react";
import Carousel from "react-elastic-carousel";

import ProductCard from "./ProductCard";

function SelectProducts({ tag }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(`/product/select/${tag}/6/`) // 6 = length of product list
      .then((response) => {
        setProducts(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [tag]);

  const breakpoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 3 },
  ];
  return (
    <div className="selectProducts">
      <h3>{tag} Products</h3>
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

export default SelectProducts;
