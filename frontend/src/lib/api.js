import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
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
export const getBorrows = () => api.get("/borrows").then((r) => r.data);
export const createBorrow = (data) =>
  api.post("/borrow/create", data).then((r) => r.data);
export const returnBorrow = (bookId, stdId) =>
  api.post(`/borrow/${bookId}/${stdId}/return`).then((r) => r.data);

export default api;
