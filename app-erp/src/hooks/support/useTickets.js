import { useState, useEffect } from "react";
import { ticketsAPI } from "@/api/support/ticketsAPI";
import tmub_tickt from "@/models/support/tmub_tickt.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const dataModel = generateDataModel(tmub_tickt, { edit_stop: 0 });

export const useTickets = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadTickets = async () => {
    try {
      const response = await ticketsAPI.getAll({
        tickt_users: user.users_users,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading tickets:", error);
      showToast("error", "Error", error?.message || "Failed to load tickets");
    }
  };

  useEffect(() => {
    if (user?.users_users) {
      loadTickets();
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmub_tickt);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    const today = new Date().toISOString().slice(0, 16);
    setFormData({
      ...dataModel,
      tickt_cmdat: today,
      tickt_cmsts: "Opened",
    });
    setCurrentView("form");
  };

  const handleStatusUpdate = async (ticket, newStatus) => {
    try {
      const updatedTicket = { ...ticket, tickt_cmsts: newStatus };
      // Also sync active flag for compatibility with existing logic
      updatedTicket.tickt_actve =
        newStatus === "Resolved" || newStatus === "Closed" ? 0 : 1;

      const response = await ticketsAPI.update(updatedTicket);
      if (response.success) {
        showToast("success", "Status Updated", `Ticket marked as ${newStatus}`);
        loadTickets();
      }
    } catch (error) {
      showToast("error", "Error", "Failed to update status");
    }
  };

  const handleEdit = (data) => {
    // Format date for datetime-local input
    const formattedData = {
      ...data,
      tickt_cmdat: data.tickt_cmdat
        ? new Date(data.tickt_cmdat).toISOString().slice(0, 16)
        : "",
      tickt_rsdat: data.tickt_rsdat
        ? new Date(data.tickt_rsdat).toISOString().slice(0, 16)
        : "",
    };
    setFormData(formattedData);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      const response = await ticketsAPI.delete(rowData);
      if (response.success) {
        showToast(
          "info",
          "Ticket Updated",
          response.message || "Status changed",
        );
        loadTickets();
      } else {
        showToast(
          "error",
          "Error",
          response.message || "Failed to update ticket status",
        );
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      showToast("error", "Error", error?.message || "Failed to delete ticket");
    }
  };

  const handleRefresh = () => {
    loadTickets();
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    try {
      setIsBusy(true);

      const newErrors = validate(formData, tmub_tickt);
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        tickt_users: user.users_users,
        user_id: user.id,
      };

      let response;
      if (formData.id) {
        response = await ticketsAPI.update(formDataNew);
      } else {
        response = await ticketsAPI.create(formDataNew);
      }

      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message || "Operation completed",
      );

      if (response.success) {
        handleClear();
        setCurrentView("list");
        loadTickets();
      }
    } catch (error) {
      console.error("Error saving ticket:", error);
      showToast("error", "Error", error?.message || "Failed to save ticket");
    } finally {
      setIsBusy(false);
    }
  };

  return {
    dataList,
    isBusy,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
    handleStatusUpdate,
  };
};
