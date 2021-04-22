import React from "react";
import LatestProducts from "../components/LatestProducts";
import Subscription from "../components/Subscription";
import Accessible from "../layouts/Accessible";

function Home() {
  return (
    <Accessible>
      <div>
        <Subscription />
        Home page
        {/* banners */}
        {/* latest products */}
        <LatestProducts />
      </div>
    </Accessible>
  );
}

export default Home;
