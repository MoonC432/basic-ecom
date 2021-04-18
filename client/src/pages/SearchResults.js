import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import Accessible from "../layouts/Accessible";

const styles = {
  display: "flex",
  margin: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
};

function SearchResults() {
  const products = useSelector((state) => state.searchResults.products);
  return (
    <Accessible>
      <div style={styles} className="searchResults">
        {products.length > 0 ? (
          products.map((product, i) => (
            <ProductCard key={i} productInfo={product} />
          ))
        ) : (
          <div>No Results Found</div>
        )}
      </div>
    </Accessible>
  );
}

export default SearchResults;
