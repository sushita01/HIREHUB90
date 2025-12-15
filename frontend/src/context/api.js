// context/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite proxy will forward this to your backend
  withCredentials: true, // in case you use cookies
});

export default api;
