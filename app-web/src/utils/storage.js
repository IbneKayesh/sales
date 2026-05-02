// Centralized localStorage utility for managing app data
const STORAGE_KEY = "eaac02May2026user";
const STORAGE_KEY_LOGIN = "eaac02May2026conf";

const defaultData = {
  users: null,
  bsins: null,
  token: null,
  menus: [],
  recent_links: []
};

const confData = {
  saved_user: null,
  is_saved: false,
  theme: "green"
};

const getStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...defaultData, ...JSON.parse(data) } : { ...defaultData };
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return { ...defaultData };
  }
};

const setStorageData = (data) => {
  try {
    const currentData = getStorageData();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

const clearStorageData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};


const getStorageLoginData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LOGIN);
    return data ? { ...confData, ...JSON.parse(data) } : { ...confData };
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return { ...confData };
  }
};

const setStorageLoginData = (data) => {
  try {
    const currentData = getStorageLoginData();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY_LOGIN, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};


export { getStorageData, setStorageData, clearStorageData, getStorageLoginData, setStorageLoginData };
