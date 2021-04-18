const initialState = {
  user: null,
};

export default function _(state = initialState, action) {
  switch (action.type) {
    case "SET_USER_ACCOUNT_INFO":
      return {
        user: action.payload,
      };
    default:
      return state;
  }
}
