// src/config/app.config.js

export const APP_CONFIG = {
    // App Identity
    name: {
        english: "Gunaso",
        nepali: "गुनासो",
    },
    tagline: "Report. Track. Resolve.",
    version: "1.0.0",

    // API Configuration
    api: {
        baseURL:
            import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
        timeout: 10000,
    },

    // Theme Colors
    colors: {
        primary: "#DC143C", // Crimson
        primaryDark: "#B71C1C",
        primaryLight: "#FF5252",
        secondary: "#1E3A8A", // Nepal flag blue
        accent: "#FFD700", // Gold
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
    },

    // Status Colors
    statusColors: {
        pending: "#EF4444", // Red
        "in-progress": "#F59E0B", // Yellow
        solved: "#10B981", // Green
        verified: "#3B82F6", // Blue
    },

    // Complaint Categories
    categories: [
        { value: "pothole", label: "Pothole" },
        { value: "streetlight", label: "Street Light" },
        { value: "garbage", label: "Garbage" },
        { value: "drainage", label: "Drainage" },
        { value: "water supply", label: "Water Supply" },
        { value: "other", label: "Other" },
    ],

    // Urgency Levels
    urgencyLevels: [
        { value: "low", label: "Low", color: "#10B981" },
        { value: "medium", label: "Medium", color: "#F59E0B" },
        { value: "high", label: "High", color: "#EF4444" },
    ],

    // Status Options
    statuses: [
        { value: "pending", label: "Pending" },
        { value: "in-progress", label: "In Progress" },
        { value: "solved", label: "Pending Verification" }, // Updated label
        { value: "verified", label: "Verified" },
    ],

    // Map Configuration
    map: {
        defaultCenter: {
            lat: 27.7172,
            lng: 85.324,
        },
        defaultZoom: 13,
        nearbyRadius: 1, // km
        markerClusterRadius: 50,
    },

    // File Upload
    upload: {
        maxFiles: 3,
        maxSizePerFile: 5 * 1024 * 1024, // 5MB
        acceptedFormats: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    },

    // Pagination
    pagination: {
        defaultPageSize: 10,
        pageSizeOptions: [5, 10, 20, 50],
    },

    // Local Storage Keys
    storageKeys: {
        token: "gunaso_token",
        user: "gunaso_user",
        theme: "gunaso_theme",
        language: "gunaso_language",
    },

    // Cities (Nepal)
    cities: [
        "Kathmandu",
        "Pokhara",
        "Lalitpur",
        "Bhaktapur",
        "Biratnagar",
        "Birgunj",
        "Dharan",
        "Bharatpur",
        "Janakpur",
        "Hetauda",
        "Dhangadhi",
    ],

    // Contact & Social
    contact: {
        email: "support@gunaso.com",
        phone: "+977-1-4000000",
    },

    // Map
    map: {
        defaultCenter: {
            lat: 27.7172,
            lng: 85.324,
        },
        defaultZoom: 13,
        nearbyRadius: 1, // km
        markerClusterRadius: 50,
        mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN,
    },

    // Feature Flags
    features: {
        enableNotifications: true,
        enableVoiceInput: false,
        enableAI: false,
        enableHeatmap: true,
    },
};

export default APP_CONFIG;
