import axios from "axios";
import APP_CONFIG from "../config/app.config";

const api = axios.create({
    baseURL: APP_CONFIG.api.baseURL,
    timeout: APP_CONFIG.api.timeout,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(APP_CONFIG.storageKeys.token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect on 401 if NOT already on login/register page
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== "/login" && currentPath !== "/register") {
                localStorage.removeItem(APP_CONFIG.storageKeys.token);
                localStorage.removeItem(APP_CONFIG.storageKeys.user);
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    },
);

// API methods
export const authAPI = {
    register: (data) => api.post("/users/register", data),
    login: (data) => api.post("/users/login", data),
    getProfile: () => api.get("/users/profile"),
};

export const complaintAPI = {
    create: (data) => api.post("/complaints", data),
    getByCity: (city, params) =>
        api.get(`/complaints/city/${city}`, { params }),
    getById: (id) => api.get(`/complaints/${id}`),
    getNearby: (params) => api.get("/complaints/nearby", { params }),
    updateStatus: (id, status) =>
        api.patch(`/complaints/${id}/status`, { status }),
    upvote: (id) => api.post(`/complaints/${id}/upvote`),
};

export const verificationAPI = {
    create: (data) => api.post("/verifications", data),
    getByComplaint: (complaintId) =>
        api.get(`/verifications/complaint/${complaintId}`),
    checkVerification: (complaintId) =>
        api.get(`/verifications/check/${complaintId}`),
};

export const uploadAPI = {
    uploadImages: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        return api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

export default api;
