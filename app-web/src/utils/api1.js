import { getStorageData, setStorageData, clearStorageData } from "./storage";

// Centralized API utility for backend communication
const API_BASE_URL = "/api";

const apiLogin = async (options) => {
  //console.log("fromDataAPI", options.body);

  const app_url = "http://testapp.sprolab.com/api";
  const app_name = "Test";

  const endpoint = `/v4/loginApi?key=${app_name}`;
  const url = `${app_url}${endpoint}`;
  const incomingBody = options.body || {};
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
      // return {
      //   SUCCESS: false,
      //   ROWS: 0,
      //   MESSAGE:
      //     data?.MESSAGE || `Request failed with status ${response.status}`,
      //   DynamicData: data || null,
      // };
    }
    //create storage
    //console.log("response", response);

    if (data.result) {
      // const { users, bsins, token } = data.data;
      setStorageData({ users: data });
      // setStorageData({ bsins: bsins });
      setStorageData({ token: data.token });
    }
    return data; // { success, message, data }
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
    // return {
    //   SUCCESS: false,
    //   ROWS: 0,
    //   MESSAGE: error.message || "Network error",
    //   DynamicData: null,
    // };
  }
};

const apiRequest = async (apiVersion, apiEndPoint, options) => {
  const storedUser = getStorageData()?.users;
  const apiUrl = storedUser.host + apiVersion + storedUser.contId + apiEndPoint;

  const incomingBody = options.body || {};
  incomingBody.aemp_eusr = storedUser.aempId;

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storedUser.token}`,
    },
    body: JSON.stringify(incomingBody),
  };
  try {
    const response = await fetch(apiUrl, config);
    // Safely parse JSON
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    // Handle HTTP errors
    if (response.status === 401) {
      console.error("Unauthorized - token may be invalid or expired");
      clearStorageData();
    }

    if (!response.ok) {
      throw new Error(data?.message || "Request failed");
    }
    //console.log("response", data);
    return data;
  } catch (error) {
    console.error(`API request failed: ${apiEndPoint}`, error);
    throw error;
  }
};


export { apiLogin, apiRequest };
