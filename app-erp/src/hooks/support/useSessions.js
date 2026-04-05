import { useState, useEffect } from "react";
import { sessionsAPI } from "@/api/support/sessionsAPI";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export const useSessions = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);

  const loadSessions = async () => {
    try {
      const response = await sessionsAPI.getAll({
        users: user?.users_users,
      });
      // response = { message, data }

      setDataList(response.data);
      //showToast("success", "Success", response.message);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const killSession = async (sessionId) => {
    try {
      const response = await sessionsAPI.delete({
        sessionId: sessionId,
      });
      showToast("success", "Session Killed", response.message);
      setDataList((prevData) =>
        prevData.filter((item) => item.sessionId !== sessionId)
      );
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", "Error", error?.message || "Failed to load data");
    }
  };

  const handleRefresh = () => {
    loadSessions();
  };

  const handleDelete = (rowData) => {
    killSession(rowData.sessionId);
  };

  return {
    dataList,
    handleRefresh,
    handleDelete,
  };
};
