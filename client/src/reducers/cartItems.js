const initialState = {
  products: [],
};

export default function _(state = initialState, action) {
  switch (action.type) {
    default:
      return state;

    case "ADD_TO_CART":
      return {
        ...state,
        products: [...state.products, action.product],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.id),
      };

    case "SET_PRODUCT_QUANTITY":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.product.id
            ? {
                ...product,
                quantity:
                  action.quantity && action.quantity >= 1
                    ? action.quantity <= action.product.stock
                      ? parseInt(action.quantity)
                      : parseInt(action.product.stock)
                    : 0,
              }
            : product
        ),
      };

    case "INCREMENT_QUANTITY":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.product.id
            ? {
                ...product,
                quantity:
                  product.stock > product.quantity
                    ? product.quantity + 1
                    : product.stock,
              }
            : product
        ),
      };

    case "DECREMENT_QUANTITY":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.product.id
            ? {
                ...product,
                quantity: 1 < product.quantity ? product.quantity - 1 : 0,
              }
            : product
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        products: [],
      };
  }
}
