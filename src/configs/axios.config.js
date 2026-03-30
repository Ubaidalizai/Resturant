// axiosConfig.js
import axios from "axios";

// Set global defaults
axios.defaults.withCredentials = true; // <-- Automatically send cookies for all requests

export default axios;