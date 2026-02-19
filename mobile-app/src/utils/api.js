// Centralized API utility for backend communication
const API_BASE_URL = "/api";

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from storage
  const token = localStorage.getItem("sgd25");

  const config = {
    headers: {
      "Content-Type": "application/json",
      "app-api-key": import.meta.env.VITE_APP_API_KEY,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      // Optional: Handle 401 specifically to clear token if needed
      if (response.status === 401) {
        // console.warn('Unauthorized access, consider redirecting to login');
        throw new Error("Unauthorized access, login again to start session");
      }
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export { apiRequest };
