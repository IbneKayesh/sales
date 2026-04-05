// Centralized API utility for backend communication
const API_BASE_URL = "/api";

interface ApiRequestOptions extends RequestInit {
  body?: any;
  headers?: Record<string, string>;
}

const apiRequest = async (endpoint: string, options: ApiRequestOptions = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from storage
  const token = localStorage.getItem("sgdwt25");

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "app-api-key": import.meta.env.VITE_APP_API_KEY as string,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access, login again to start session");
      }
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export { apiRequest };
