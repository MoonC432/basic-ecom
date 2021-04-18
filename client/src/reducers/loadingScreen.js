const initialState = {
  loading: false,
};

export default function _(state = initialState, action) {
  switch (action.type) {
    case "SET_LOADING":
      return {
        loading: action.loading,
      };
    default:
      return state;
  }
}
