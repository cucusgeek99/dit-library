export const saveAuthData = (data) => {
    if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
    }

    if (data?.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
    }

    if (data?.token_type) {
        localStorage.setItem("token_type", data.token_type);
    }

    if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
    }
};

export const clearAuthData = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user");
};

export const getStoredUser = () => {
    const rawUser = localStorage.getItem("user");

    if (!rawUser || rawUser === "undefined" || rawUser === "null") {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch (error) {
        console.error("Erreur lors de la lecture du user dans localStorage :", error);
        localStorage.removeItem("user");
        return null;
    }
};

export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("access_token");
};