const initialState = {
  response: null,
};

export default function _(state = initialState, action) {
  switch (action.type) {
    case "SET_RESPONSE_MESSAGE":
      return {
        response: action.message,
      };
    default:
      return state;
  }
}
