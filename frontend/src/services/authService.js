import api from "./api";

export const loginUser = async (credentials) => {
    const response = await api.post("/user/login", credentials);
    return response.data;
};

export const getCurrentUser = async (token) => {
    const response = await api.get("/user/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};