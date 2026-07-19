import { getStorageData, setStorageData } from "./storage";
import { toast } from "../components/ToastBox";

// Centralized API utility for backend communication
const API_BASE_URL = "/api";

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // default attachments
  // Get token from storage
  const token = getStorageData()?.token;
  const storedUser = getStorageData()?.emply;
  if (!token || !storedUser) {
    //throw new Error("Unauthorized access, login again to start session");
    return {
      success: false,
      message: "Unauthorized access, login again to start session",
      data: [],
    };
  }

  const reqData = {
    user_s: storedUser.id, //this User Id or self Id
    user_c: storedUser.emply_users, //this Master User Id or contract Id
    user_b: storedUser.emply_bsins, //this Business Id
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
      "x-tenant-id": storedUser.users_aplnk || 'default', //this Database Id
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
      if (response.status === 401) {
        toast.error("Session expired.");
        //throw new Error("Unauthorized. Please login again.");
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        return {
          success: false,
          message: "Unauthorized. Please login again.",
          data: [],
        };
      }
      if (response.status === 502) {
        return {
          success: false,
          message: "Unable to connect. Please check your internet and try again.",
          data: [],
        };
      }
      //throw new Error(data.error || `HTTP error! status: ${response.status}`);
      return {
        success: false,
        message: data?.error || `HTTP error! status: ${response.status}`,
        data: [],
      };
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    //throw error;
    return {
      success: false,
      message: error.message || "Network error",
      data: [],
    };
  }
};

const healthCheck = async () => {
  try {
    // Use a known-working endpoint — /api/ and /api/status both return 200
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "sgd-ua-node": import.meta.env.VITE_APP_API_KEY },
      signal: AbortSignal.timeout(5000),
    });
    return { online: response.ok, status: response.status };
  } catch {
    return { online: false, status: 0 };
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
      const { emply, bsins, users, menus, token } = data.data;
      setStorageData({ emply: emply });
      setStorageData({ bsins: bsins });
      setStorageData({ users: users });
      setStorageData({ menus: menus });
      setStorageData({ token: token });
    }
    return data; // { success, message, data }
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export { apiRequest, apiLogin, healthCheck };