const STORAGE_KEY = "sgdwa25";

interface StorageData {
  user: any;
  fullMode: boolean;
  leftbarCollapsed: boolean;
  expandedMenu: any;
  recentMenus: any[];
  business: any;
}

const defaultData: StorageData = {
  user: null,
  fullMode: false,
  leftbarCollapsed: false,
  expandedMenu: null,
  recentMenus: [],
  business: null,
};

const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...defaultData, ...JSON.parse(data) } : { ...defaultData };
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return { ...defaultData };
  }
};

const setStorageData = (data: Partial<StorageData>): void => {
  try {
    const currentData = getStorageData();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

const clearStorageData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

export { getStorageData, setStorageData, clearStorageData };
export type { StorageData };
