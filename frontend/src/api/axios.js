import axios from "axios";
import { getToken, removeToken } from "../utils/token";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = getToken();

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = getToken();
      if (token) {
        removeToken();
        window.location.reload();
      }
    }
    return Promise.reject(error);
  },
);

export default API;
