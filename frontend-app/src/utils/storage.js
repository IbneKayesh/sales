// Centralized localStorage utility for managing app data
const STORAGE_KEY = 'appData';

const defaultData = {
  user: null,
  fullMode: false,
  leftbarCollapsed: false,
  expandedMenu: null,
  navigationIcons: [],
  business: null,
  // Add other data as needed
};

const getStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...defaultData, ...JSON.parse(data) } : { ...defaultData };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { ...defaultData };
  }
};

const setStorageData = (data) => {
  try {
    const currentData = getStorageData();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const clearStorageData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export { getStorageData, setStorageData, clearStorageData };
