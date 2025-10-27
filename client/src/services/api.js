import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


console.log("API URL:", process.env.REACT_APP_API_URL);


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const apiService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  signup: async (data) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  generateQuery: async (data) => {
    const response = await api.post("/generate-query", data);
    return response.data;
  },

  explainQuery: async (sql) => {
    const response = await api.post("/explain-query", { sql });
    return response.data;
  },
};

export default apiService;
