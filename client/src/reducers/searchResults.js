const initialState = {
  products: [],
};

export default function _(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    case "SET_SEARCH_RESULTS":
      return {
        products: action.payload,
      };
  }
}
