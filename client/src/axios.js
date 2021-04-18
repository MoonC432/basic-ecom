import Axios from "axios";

const token = window.localStorage.getItem("Token");
const instance = Axios.create({
  baseURL: process.env.REACT_APP_SERVER_API,
  headers: {
    Authorization: token ? `Token ${token}` : "",
  },
});
export default instance;
