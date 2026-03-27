import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (credentials) =>
  api.post("/user/login", credentials).then((r) => r.data);

// Books
export const getBooks = () => api.get("/books").then((r) => r.data);
export const createBook = (data) =>
  api.post("/book/create", data).then((r) => r.data);
export const updateBook = (id, data) =>
  api.put(`/book/${id}/update`, data).then((r) => r.data);
export const deleteBook = (id) =>
  api.delete(`/book/${id}/delete`).then((r) => r.data);

// Users
export const getUsers = () => api.get("/users/").then((r) => r.data);
export const createUser = (data) =>
  api.post("/user/create", data).then((r) => r.data);
export const deleteUser = (id) =>
  api.delete(`/user/${id}/delete`).then((r) => r.data);

// Borrows
export const getBorrows = async () => {
  const res = await api.get("/borrows");
  return res.data;
};

export const createBorrow = async (payload) => {
  const res = await api.post("/borrow/create", payload);
  return res.data;
};

export const returnBorrow = async (bookId, userId) => {
  const res = await api.post(`/borrow/${bookId}/${userId}/return`);
  return res.data;
};

export default api;
