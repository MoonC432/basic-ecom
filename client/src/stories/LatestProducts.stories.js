import React from "react";

import { LatestProducts } from "./LatestProducts";

export default {
  title: "Latest Products",
  component: LatestProducts,
};

const Template = (args) => <LatestProducts {...args} />;

export const Primary = Template.bind({});
