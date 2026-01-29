import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  signup: (username: string, password: string) =>
    api.post("/api/v1/signup", { username, password }),

  signin: (username: string, password: string) =>
    api.post<{ token: string }>("/api/v1/signin", { username, password }),
};

export const contentApi = {
  getAll: () => api.get("/api/v1/content"),

  create: (title: string, link: string, type: string) =>
    api.post("/api/v1/content", { title, link, type }),

  delete: (id: string) => api.delete(`/api/v1/delete/${id}`),

  toggleShare: (share: boolean) =>
    api.post<{ hash?: string; message?: string }>("/api/v1/stash", { share }),

  getShared: (hash: string) => api.get(`/api/v1/stash/${hash}`),
};

export const searchApi = {
  search: (query: string) => api.post("/api/v1/search", { query }),
};
