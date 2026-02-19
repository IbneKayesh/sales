import { useState, useEffect } from "react";
import { notesAPI } from "@/api/support/notesAPI";
import tmub_notes from "@/models/support/tmub_notes.json";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const dataModel = generateDataModel(tmub_notes, { edit_stop: 0 });

export const useNotes = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dataList, setDataList] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getAll({
        notes_users: user.users_users,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading notes:", error);
      showToast("error", "Error", error?.message || "Failed to load notes");
    }
  };

  useEffect(() => {
    if (user?.users_users) {
      loadNotes();
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmub_notes);
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
      notes_dudat: today,
      notes_stat: "In Progress",
    });
    setCurrentView("form");
  };

  const handleStatusUpdate = async (note, newStatus) => {
    try {
      const updatedNote = { ...note, notes_stat: newStatus };
      // Also sync active flag for compatibility with existing logic
      updatedNote.notes_actve =
        newStatus === "Completed" || newStatus === "Cancelled" ? 0 : 1;

      const response = await notesAPI.update(updatedNote);
      if (response.success) {
        showToast("success", "Status Updated", `Note marked as ${newStatus}`);
        loadNotes();
      }
    } catch (error) {
      showToast("error", "Error", "Failed to update status");
    }
  };

  const handleEdit = (data) => {
    // Format date for datetime-local input
    const formattedData = {
      ...data,
      notes_dudat: data.notes_dudat
        ? new Date(data.notes_dudat).toISOString().slice(0, 16)
        : "",
    };
    setFormData(formattedData);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      const response = await notesAPI.delete(rowData);
      if (response.success) {
        showToast("info", "Note Updated", response.message || "Status changed");
        loadNotes();
      } else {
        showToast(
          "error",
          "Error",
          response.message || "Failed to update note status"
        );
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      showToast("error", "Error", error?.message || "Failed to delete note");
    }
  };

  const handleRefresh = () => {
    loadNotes();
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    try {
      setIsBusy(true);

      const newErrors = validate(formData, tmub_notes);
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      const formDataNew = {
        ...formData,
        id: formData.id || generateGuid(),
        notes_users: user.users_users,
        user_id: user.id,
      };

      let response;
      if (formData.id) {
        response = await notesAPI.update(formDataNew);
      } else {
        response = await notesAPI.create(formDataNew);
      }

      showToast(
        response.success ? "success" : "error",
        response.success ? "Success" : "Error",
        response.message || "Operation completed"
      );

      if (response.success) {
        handleClear();
        setCurrentView("list");
        loadNotes();
      }
    } catch (error) {
      console.error("Error saving note:", error);
      showToast("error", "Error", error?.message || "Failed to save note");
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
