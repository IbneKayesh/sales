import { getStorageData, setStorageData } from "./storage";

// Centralized API utility for backend communication
const API_BASE_URL = "/api";

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // default attachments
  // Get token from storage
  const token = getStorageData()?.token;
  const storedUser = getStorageData()?.users;
  if (!token || !storedUser) {
    throw new Error("Unauthorized access, login again to start session");
  }

  const reqData = {
    user_s: storedUser.id, //thisUserId //self
    user_m: storedUser.users_users, //thisMasterUserId //master
    user_b: storedUser.users_bsins //thisBusinessId //business
  };
  //merge to body
  const incomingBody = options.body || {};
  const finalBody = {
    ...incomingBody,
    ...reqData,
  };

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sgd-ua-node": import.meta.env.VITE_APP_API_KEY,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: JSON.stringify(finalBody),
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

const apiLogin = async (options) => {
  const endpoint = `/auth/v1/login`;
  const url = `${API_BASE_URL}${endpoint}`;
  const incomingBody = options.body || {};
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer token.token.token`,
      "sgd-ua-node": import.meta.env.VITE_APP_API_KEY,
    },
    body: JSON.stringify(incomingBody),
  };
  try {
    const response = await fetch(url, config);
    // Safely parse JSON
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(data?.message || "Request failed");
    }
    //create storage
    if (data.success) {
      const { users, bsins, token } = data.data;
      setStorageData({ users: users });
      setStorageData({ bsins: bsins });
      setStorageData({ token: token });
    }
    return data; // { success, message, data }
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export { apiRequest, apiLogin };
