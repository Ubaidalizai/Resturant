// axiosConfig.js
import axios from "axios";
import i18n from "../i18n/i18n";

// Set global defaults
axios.defaults.withCredentials = true; // <-- Automatically send cookies for all requests

// Add request interceptor to set language header
axios.interceptors.request.use(
  (config) => {
    config.headers["x-lang"] = i18n.language;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;