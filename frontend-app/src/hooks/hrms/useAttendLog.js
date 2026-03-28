import { useState, useEffect } from "react";
import { attendanceLogAPI } from "@/api/hrms/attendanceLogAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmhb_atnlg from "@/models/hrms/tmhb_atnlg.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";

const dataModel = generateDataModel(tmhb_atnlg, { edit_stop: 0 });
const LS_KEY = "attendance_log_pending";

// ── localStorage helpers ──────────────────────────────────────────────────────
const lsRead = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
};

const lsWrite = (list) => {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
};

const lsClear = () => {
  localStorage.removeItem(LS_KEY);
};

export const useAttendLog = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);

  //local storage
  const [localList, setLocalList] = useState(lsRead); // pending localStorage records

  const loadAttendanceLogs = async () => {
    try {
      setIsBusy(true);
      const response = await attendanceLogAPI.getAll({
        atnlg_users: user.users_users,
        atnlg_bsins: user.users_bsins,
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Attendance Log",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadAttendanceLogs();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, tmhb_atnlg);
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
    setCurrentView("form");
  };

  const handleEdit = (data) => {
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData) => {
    try {
      setIsBusy(true);
      const formDataNew = {
        ...rowData,
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await attendanceLogAPI.delete(formDataNew);

      if (response.success) {
        setDataList((prev) => prev.filter((u) => u.id !== rowData.id));
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Attendance Log - ${rowData.atnlg_ecode || rowData.atnlg_crdno} ${
          response.success ? "is deleted by" : "delete failed by"
        } ${user.users_oname}`,
        toast: true,
        notification: false,
        log: true,
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      notify({
        severity: "error",
        summary: "Attendance Log",
        detail: error?.message || "Failed to delete data",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefresh = () => {
    loadAttendanceLogs();
  };    

  // ── Save to localStorage (fast, no network) ─────────────────────────────────
  const handleSave = (e) => {
    e.preventDefault();

    // Validation: at least one of ecode or crdno must be provided
    const newErrors = validate(formData, tmhb_atnlg);
    if (!formData.atnlg_ecode && !formData.atnlg_crdno) {
      newErrors.atnlg_ecode = "Employee Code or Card Number is required";
      newErrors.atnlg_crdno = "Employee Code or Card Number is required";
    }
    setErrors(newErrors);
    console.log("handleSave: " + JSON.stringify(newErrors));
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const formDataNew = {
      ...formData,
      id: generateGuid(),
      muser_id: user.users_users,
      suser_id: user.id,
      bsins_id: user.users_bsins,
      atnlg_lgtim: new Date().toISOString(),
      atnlg_actve: true,
      edit_stop: 0,
    };

    const updated = [...lsRead(), formDataNew];
    lsWrite(updated);
    setLocalList(updated);

    notify({
      severity: "success",
      summary: "Queued",
      detail: `${formData.atnlg_ecode || formData.atnlg_crdno} saved locally — sync when ready`,
      toast: true,
      notification: false,
      log: false,
    });

    handleClear();
  };

  // ── Sync all localStorage entries to DB, then clear ─────────────────────────
  const handleSync = async () => {
    const pending = lsRead();
    if (pending.length === 0) {
      notify({
        severity: "info",
        summary: "Sync",
        detail: "No pending records to sync",
        toast: true,
        notification: false,
        log: false,
      });
      return;
    }

    try {
      setIsBusy(true);

      // Fire all inserts in parallel for speed
      const results = await Promise.allSettled(
        pending.map((entry) => attendanceLogAPI.create(entry)),
      );

      const succeeded = results.filter(
        (r) => r.status === "fulfilled" && r.value?.success,
      ).length;
      const failed = pending.length - succeeded;

      // Only keep failed entries in localStorage
      const failedEntries = pending.filter(
        (_, i) =>
          results[i].status === "rejected" || !results[i].value?.success,
      );
      lsWrite(failedEntries);
      setLocalList(failedEntries);

      notify({
        severity: failed === 0 ? "success" : "warn",
        summary: "Sync",
        detail:
          failed === 0
            ? `All ${succeeded} record(s) synced to database`
            : `${succeeded} synced, ${failed} failed — retrying on next sync`,
        toast: true,
        notification: false,
        log: true,
      });

      // Refresh DB list after sync
      await loadAttendanceLogs();
    } catch (error) {
      console.error("Sync error:", error);
      notify({
        severity: "error",
        summary: "Sync",
        detail: error?.message || "Sync failed",
        toast: true,
        notification: true,
        log: false,
      });
    } finally {
      setIsBusy(false);
    }
  };

  // ── Delete from localStorage (discard pending entry) ────────────────────────
  const handleDeleteLocal = (rowData) => {
    const updated = lsRead().filter((r) => r.id !== rowData.id);
    lsWrite(updated);
    setLocalList(updated);
    notify({
      severity: "info",
      summary: "Removed",
      detail: `Pending entry for ${rowData.atnlg_ecode || rowData.atnlg_crdno} removed`,
      toast: true,
      notification: false,
      log: false,
    });
  };


  return {
    isBusy,
    dataList,
    localList,
    errors,
    formData,
    handleChange,
    handleClear,
    handleDelete,
    handleDeleteLocal,
    handleRefresh,
    handleSave,
    handleSync,
  };
};
