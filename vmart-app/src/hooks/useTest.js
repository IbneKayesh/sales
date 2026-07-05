import { useEffect, useState } from "react";
import { useAppUI } from "@/hooks/useAppUI";

const useDemo = () => {
  // hooks
  const { showToast, confirm, alert, isBusy, setIsBusy } = useAppUI();
  const [pgView, setPgView] = useState("list"); // 'list' or 'form'
  const [pgTitle, setTitle] = useState("Role");
  const [dataListRole, setDataListRole] = useState([]);
  const [formData, setFormData] = useState({});
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initial data fetch could go here
  }, []);

  const showBusy = (state) => {
    setIsBusy(state ?? true);
    if (state === true || state === undefined) {
      setTimeout(() => setIsBusy(false), 3000); // Auto-hide after 3s for demo
    }
  };

  const showToastMessage = (
    severity = "success",
    summary = "Success",
    detail = "Action completed successfully",
  ) => {
    showToast(severity, summary, detail);
  };

  const showConfirm = () => {
    confirm({
      message: "Do you want to save this role?",
      header: "Save Confirmation",
      accept: () => {
        console.log("ok");
        showToast("success", "Confirmed", "You accepted the action");
      },
      reject: () => {
        console.log("rejet");
        showToast("warn", "Rejected", "You rejected the action");
      },
    });
  };

  const showDone = async () => {
    alert({ message: "Role setup completed" });
  };

  return {
    showBusy,
    showToastMessage,
    showConfirm,
    showDone,
    remarks,
    setRemarks,
    pgView,
    setPgView,
    pgTitle,
    dataListRole,
    formData,
    errors,
  };
};

export default useDemo;
