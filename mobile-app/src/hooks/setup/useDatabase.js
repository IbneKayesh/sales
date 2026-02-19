import { useState, useEffect } from "react";
import { databaseAPI } from "@/api/setup/databaseAPI";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export const useDatabase = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'

  const loadDatabase = async () => {
    try {
      setIsBusy(true);
      const response = await databaseAPI.getAll({
        id: user?.users_users,
      });

      if (response && response.data) {
        setDataList(response.data);
      }
    } catch (error) {
      console.error("Error loading database backups:", error);
      showToast("error", "Error", error?.message || "Failed to load backups");
    } finally {
      setIsBusy(false);
    }
  };

  // Fetch backups on mount
  useEffect(() => {
    if (user) {
      loadDatabase();
    }
  }, [user]);

  const handleDelete = async (rowData) => {
    try {
      setIsBusy(true);
      const response = await databaseAPI.delete({ name: rowData.name });

      if (response.success) {
        const updatedList = dataList.filter((s) => s.id !== rowData.id);
        setDataList(updatedList);
      }

      showToast(
        response.success ? "info" : "error",
        response.success ? "Deleted" : "Error",
        response.message,
      );
    } catch (error) {
      console.error("Error deleting backup:", error);
      showToast("error", "Error", error?.message || "Failed to delete backup");
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefresh = () => {
    loadDatabase();
  };

  const handleCreate = async () => {
    try {
      setIsBusy(true);
      const payload = {
        id: generateGuid(),
        user_id: user?.id,
      };

      const response = await databaseAPI.create(payload);

      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message,
      );

      if (response.success) {
        await loadDatabase();
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      showToast("error", "Error", error?.message || "Failed to create backup");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDownload = async (rowData) => {
    try {
      setIsBusy(true);
      const blob = await databaseAPI.download(rowData.name);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = rowData.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("success", "Success", "Backup downloaded successfully");
    } catch (error) {
      console.error("Error downloading backup:", error);
      showToast(
        "error",
        "Error",
        error?.message || "Failed to download backup",
      );
    } finally {
      setIsBusy(false);
    }
  };

  return {
    dataList,
    isBusy,
    currentView,
    handleDelete,
    handleRefresh,
    handleCreate,
    handleDownload,
  };
};
