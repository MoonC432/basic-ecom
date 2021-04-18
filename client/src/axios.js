import Axios from "axios";

const instance = Axios.create({
  baseURL: process.env.REACT_APP_SERVER_API,
});
export default instance;
