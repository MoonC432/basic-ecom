const initialState = {
  loading: false,
  openSubscribe: false,
};

export default function _(state = initialState, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_SUBSCRIBE":
      return { ...state, openSubscribe: action.open };
    default:
      return state;
  }
}
