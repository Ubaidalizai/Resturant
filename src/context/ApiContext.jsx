import React, { createContext, useContext } from "react";
import axios from "../configs/axios.config";
import { baseURL as configBaseURL } from "../configs/baseURL.config";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  // simple wrappers so that components don't have to import axios or baseURL directly
  const get = (endpoint, config) => axios.get(`${configBaseURL}${endpoint}`, config);
  const post = (endpoint, data, config) => axios.post(`${configBaseURL}${endpoint}`, data, config);
  const put = (endpoint, data, config) => axios.put(`${configBaseURL}${endpoint}`, data, config);
  const del = (endpoint, config) => axios.delete(`${configBaseURL}${endpoint}`, config);

  return (
    <ApiContext.Provider value={{ get, post, put, del, baseURL: configBaseURL }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
