// Centralized localStorage utility for managing app data
import defaultLogo from "@/assets/logo-bs.png";

const STORAGE_KEY = "eaac02May2026user";
const STORAGE_KEY_LOGIN = "eaac02May2026conf";

const defaultData = {
  emply: null,
  bsins: null,
  users: null,
  prtnr: null,
  token: null,
  menus: [],
  recent_links: [],
};

const confData = {
  saved_user: null,
  is_saved: false,
  theme: "emerald",
  darkMode: "light",
  font: "sfpro",
  fontSize: 14,
  density: 90,
  compSize: 75,
  radius: 12,
  reduceMotion: false,
  customColor: null,
  // Aesthetic defaults: every background target (Workspace, Title bar, Page
  // background, Top bar) is empty, so the theme colors / frosted surfaces
  // show through. The bundled emerald monogram logo matches the default
  // theme. Wallpapers are opt-in via the Theme page presets.
  bgImage: null,
  titlebarBgImage: null,
  pageBgImage: null,
  topbarBgImage: null,
  bgColor: null,
  pageBgColor: null,
  titlebarBgColor: null,
  topbarBgColor: null,
  logoImage: defaultLogo,
  layout: "boxed",
  boxedGap: 30,
  bgAnim: "rain",
  bgAnimScope: "app",
  bgAnimMode: "idle",
  bgAnimSettings: {
    density: 85,
    color: "",
    opacity: 80,
    size: 90,
    speed: 90,
    idleMin: 1,
  },
  sidebar: "visible",
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

export {
  getStorageData,
  setStorageData,
  clearStorageData,
  getStorageLoginData,
  setStorageLoginData,
};
