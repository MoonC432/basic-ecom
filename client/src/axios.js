import Axios from "axios";

const instance = Axios.create({
  baseURL: process.env.REACT_APP_SERVER_API,
  // baseURL : "http://127.0.0.1:8000",
});
export default instance;
