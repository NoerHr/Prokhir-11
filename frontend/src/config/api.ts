import axios from "axios";

// Base URL untuk API
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:2006";

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// API Endpoints - Centralized endpoint constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  // Items (Barang)
  ITEMS: {
    LIST: "/items",
    CREATE: "/items",
    DELETE: (id: number) => `/items/${id}`,
    CLAIM: (id: number) => `/items/${id}/claim`,
  },

  // Categories
  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories",
    UPDATE_STATUS: (id: number) => `/categories/${id}/status`,
    DELETE: (id: number) => `/categories/${id}`,
  },

  // Claims
  CLAIMS: {
    LIST: "/claims",
    CREATE: "/claims",
    BY_USER: (userId: number) => `/claims/user/${userId}`,
    UPDATE_STATUS: (id: number) => `/claims/${id}/status`,
    DELETE: (id: number) => `/claims/${id}`,
  },
};

export default api;
